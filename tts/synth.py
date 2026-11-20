"""Озвучка manim-ролика через Qwen3-TTS: синтез → проверка Whisper → durations.json → сведение с видео.

Запуск из корня репо (в контейнере qwen3-tts):
    tts/run.sh ai_ml_intro --no-mix          # синтез + проверка; durations.json для narrated.voice()
    tts/run.sh ai_ml_intro                   # то же (из кэша) + сведение с manim/ai_ml_intro/ai_ml_intro.mp4
    tts/run.sh ai_ml_intro --only Intro Llm  # только эти сцены
    tts/run.sh ai_ml_intro --speakers        # первая фраза каждым голосом → out/<video>/speakers/

Результат — tts/out/<video>/<голос>/:
    chunks/<ключ>.wav|json   кусок речи (тишина по краям срезана) и его метаданные; ключ — хэш
                             голоса и произносимого текста, так что правка одной реплики не трогает остальные
    durations.json           {текст реплики: длительность, с} — по нему narrated.voice() держит кадр
    voice.wav  report.json   дорожка и отчёт сведения
    <video>_<голос>.mp4      ролик с голосом; для проекта рилсов — <имя рилса>.mp4 на каждый ролик
Язык — по тексту реплик: русский текст перед синтезом проходит normalize.py (формулы и числа словами),
китайский (иероглифы в большинстве реплик) идёт как есть, проверка Whisper — на zh;
английский (нет кириллицы в большинстве реплик) — через normalize_en.py, проверка Whisper — на en.
"""
import argparse
import ast
import hashlib
import json
import re
import subprocess
import time
from pathlib import Path

import numpy as np
import soundfile as sf
import torch

from normalize import normalize as normalize_ru
from normalize_en import normalize as normalize_en

# язык проекта: Russian, Chinese или English — по тексту реплик (иероглифы → Chinese, нет кириллицы → English)
LANG = {"name": "Russian", "asr": "ru"}
CJK = re.compile(r"[\u4e00-\u9fff]")
CYR = re.compile(r"[а-яА-ЯёЁ]")


def normalize(text):
    """Произносимый текст: русский — normalize.py, английский — normalize_en.py;
    китайский модель читает сама, включая цифры и формулы."""
    return {"Russian": normalize_ru, "English": normalize_en}.get(LANG["name"], lambda t: t)(text)

SITE = Path("/site")
TTS_MODEL = "Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice"
ASR_MODEL = "large-v3-turbo"
GAP = 0.15  # минимальная пауза между кусками при сведении


# ---------- тексты и тайминги ----------
def scenes(video_dir):
    """[(файл, класс, имя рилса | None)] в порядке показа — из SCENES в build.py или REELS в build_reels.py
    (каждый рилс — отдельный ролик с таймкодами от нуля), без импорта."""
    for build, var in (("build.py", "SCENES"), ("build_reels.py", "REELS")):
        if (video_dir / build).exists():
            for node in ast.parse((video_dir / build).read_text()).body:
                if isinstance(node, ast.Assign) and getattr(node.targets[0], "id", "") == var:
                    return [(f, cls, name if var == "REELS" else None)
                            for f, cls, *rest in ast.literal_eval(node.value) for name in [rest[0]]]
    raise SystemExit("нет SCENES в build.py или REELS в build_reels.py")


def clip_duration(video_dir, file, cls, fallback):
    """Длительность готового клипа 1080p60 — по ней builder.py склеивает ролик; нет клипа — из timings."""
    clip = video_dir / "media" / "videos" / Path(file).stem / "1080p60" / f"{cls}.mp4"
    if not clip.exists():
        return fallback
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration",
                        "-of", "csv=p=0", str(clip)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return fallback


def load_beats(video_dir, only=None):
    beats, offset, missing = [], 0.0, []
    for file, cls, reel in scenes(video_dir):
        if reel:
            offset = 0.0
        tf = video_dir / "timings" / f"{cls}.json"
        if not tf.exists():
            missing.append(cls)
            continue
        t = json.loads(tf.read_text())
        if not only or cls in only:
            for b in t["beats"]:
                beats.append({"scene": cls, "reel": reel, "start": offset + b["start"], "end": offset + b["end"],
                              "text": b["text"], "voiced": b.get("voiced", False), "total": t["duration"]})
        offset += t["duration"] if reel else clip_duration(video_dir, file, cls, t["duration"])
    if missing:
        print(f"нет timings у сцен {', '.join(missing)} — отрендерь их черновиком (-ql), чтобы появился текст")
    return beats, offset


# ---------- синтез ----------
def key(speaker, instruct, spoken):
    return hashlib.sha1(f"{speaker}|{instruct}|{spoken}".encode()).hexdigest()[:16]


def trim(w, sr, thr=0.01, pad=0.05):
    idx = np.flatnonzero(np.abs(w) > thr)
    if not len(idx):
        return w
    p = int(pad * sr)
    return w[max(idx[0] - p, 0): idx[-1] + p]


def synth(model, texts, speaker, instruct, batch, seed):
    out, sr = [], None
    for i in range(0, len(texts), batch):
        part = texts[i:i + batch]
        torch.manual_seed(seed + i)
        wavs, sr = model.generate_custom_voice(
            text=part, language=[LANG["name"]] * len(part), speaker=[speaker] * len(part),
            instruct=[instruct] * len(part), max_new_tokens=2048,
        )
        out += [trim(np.asarray(w, dtype=np.float32), sr) for w in wavs]
        print(f"  синтез {min(i + batch, len(texts))}/{len(texts)}", flush=True)
    return out, sr


# ---------- проверка разборчивости ----------
def cer(ref, hyp):
    """Доля ошибочных символов; обе строки через normalize(), чтобы «10» и «десять» не считались ошибкой."""
    clean = lambda s: re.sub(r"[^а-яёa-z0-9\u4e00-\u9fff ]", "", re.sub(r"[\s\-]+", " ", normalize(s).lower().replace("ё", "е"))).strip()
    if LANG["name"] == "Chinese":          # пробелы в китайском не значат ничего, сравниваем знаки
        clean = (lambda c: lambda s: c(s).replace(" ", ""))(clean)
    r, h = clean(ref), clean(hyp)
    d = list(range(len(h) + 1))
    for i, a in enumerate(r, 1):
        p, d[0] = d[0], i
        for j, b in enumerate(h, 1):
            p, d[j] = d[j], min(d[j] + 1, d[j - 1] + 1, p + (a != b))
    return d[-1] / max(len(r), 1)


def transcribe(asr, w, sr):
    import torchaudio.functional as F
    a = F.resample(torch.from_numpy(w), sr, 16000).numpy()   # массивом: av из qwen-tts не открывает файлы faster-whisper
    segs, _ = asr.transcribe(a, language=LANG["asr"], beam_size=5, vad_filter=True)
    return " ".join(s.text.strip() for s in segs)


# ---------- сведение ----------
def tempo(w, sr, rate):
    """Ускорение без смены тона (ffmpeg atempo)."""
    if rate <= 1.001:
        return w
    r = subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "f32le", "-ar", str(sr), "-ac", "1", "-i", "pipe:",
                        "-filter:a", f"atempo={rate:.4f}", "-f", "f32le", "pipe:"],
                       input=w.tobytes(), capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32)


def mix(beats, chunks, sr, total, max_tempo):
    """Кусок встаёт на свой таймкод. Если кадр рассчитан не под этот голос и кусок не влезает —
    ускоряем до max_tempo, дальше сдвигаем и копим отставание (видно в report.json)."""
    placed, cursor, report = [], 0.0, []
    for b, w in zip(beats, chunks):
        raw = len(w) / sr
        at = max(b["start"], cursor)
        room = b["end"] - at - GAP
        rate = min(max(raw / room, 1.0), max_tempo) if room > 0 else max_tempo
        w = tempo(w, sr, rate)
        placed.append((at, w))
        cursor = at + len(w) / sr + GAP
        report.append({"scene": b["scene"], "start": round(b["start"], 2), "placed": round(at, 2),
                       "window": round(b["end"] - b["start"], 2), "raw": round(raw, 2), "tempo": round(rate, 3),
                       "voiced": b["voiced"], "text": b["text"]})
    track = np.zeros(int(max(total, cursor) * sr) + 1, dtype=np.float32)
    for at, w in placed:
        s = int(at * sr)
        track[s:s + len(w)] += w
    return track, report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--speaker", default="Dylan")
    ap.add_argument("--instruct", default="")
    ap.add_argument("--only", nargs="*", help="только эти сцены (классы)")
    ap.add_argument("--no-mix", action="store_true", help="только синтез и проверка, без сведения с видео")
    ap.add_argument("--no-qa", action="store_true", help="не проверять куски Whisper")
    ap.add_argument("--cer", type=float, default=0.15, help="порог доли ошибочных символов для перегенерации")
    ap.add_argument("--tries", type=int, default=3, help="попыток синтеза на кусок, если не проходит порог")
    ap.add_argument("--redo", nargs="*", default=[], help="перегенерировать куски, чей текст содержит эту подстроку")
    ap.add_argument("--max-tempo", type=float, default=1.15)
    ap.add_argument("--batch", type=int, default=6)
    ap.add_argument("--seed", type=int, default=0)
    ap.add_argument("--speakers", action="store_true", help="первая фраза каждым голосом")
    args = ap.parse_args()

    video_dir = SITE / "manim" / args.video
    root = SITE / "tts" / "out" / args.video
    voice = args.speaker.lower()
    out, cdir = root / voice, root / voice / "chunks"
    cdir.mkdir(parents=True, exist_ok=True)
    beats, total = load_beats(video_dir, args.only)
    if not beats:
        raise SystemExit("нет ни одного куска озвучки")
    if sum(bool(CJK.search(b["text"])) for b in beats) > len(beats) / 2:
        LANG.update(name="Chinese", asr="zh")
    elif sum(not CYR.search(b["text"]) for b in beats) > len(beats) / 2:
        LANG.update(name="English", asr="en")
    for b in beats:
        b["spoken"] = normalize(b["text"])
        b["key"] = key(voice, args.instruct, b["spoken"])
    print(f"{args.video}: {len(beats)} кусков, голос {args.speaker}, язык {LANG['name']}")

    models = {}

    def tts():
        if "tts" not in models:
            from qwen_tts import Qwen3TTSModel
            models["tts"] = Qwen3TTSModel.from_pretrained(TTS_MODEL, device_map="cuda:0", dtype=torch.bfloat16,
                                                          attn_implementation="sdpa")
        return models["tts"]

    def asr():
        if "asr" not in models:
            from faster_whisper import WhisperModel
            models["asr"] = WhisperModel(ASR_MODEL, device="cuda", compute_type="float16")
        return models["asr"]

    if args.speakers:
        d = root / "speakers"
        d.mkdir(exist_ok=True)
        for spk in tts().get_supported_speakers():
            (w,), sr = synth(tts(), [beats[0]["spoken"]], spk, args.instruct, 1, args.seed)
            sf.write(d / f"{spk}.wav", w, sr)
        return

    meta_path = lambda b: cdir / f"{b['key']}.json"
    meta = lambda b: json.loads(meta_path(b).read_text())

    def score(b, w, sr, m):
        m["hyp"] = transcribe(asr(), w, sr)
        m["cer"] = round(cer(b["text"], m["hyp"]), 3)

    # 1. синтез того, чего нет в кэше (или явно попросили переделать), с повтором непрошедших проверку
    uniq = {b["key"]: b for b in beats}
    redo = {k for k, b in uniq.items() if any(s in b["text"] for s in args.redo)}
    todo = [b for k, b in uniq.items() if k in redo or not (cdir / f"{k}.wav").exists()]
    t0, said = time.time(), 0.0
    for attempt in range(args.tries):
        if todo:
            wavs, sr = synth(tts(), [b["spoken"] for b in todo], args.speaker, args.instruct, args.batch,
                             args.seed + 1000 * attempt + (7 if redo else 0))
            torch.cuda.empty_cache()   # кэш синтеза батчами иначе не оставляет места Whisper
            for b, w in zip(todo, wavs):
                said += len(w) / sr
                m = {"text": b["text"], "spoken": b["spoken"], "speaker": args.speaker, "instruct": args.instruct,
                     "dur": round(len(w) / sr, 3), "attempt": attempt}
                prev = meta(b) if meta_path(b).exists() and b["key"] not in redo else None
                if not args.no_qa:
                    score(b, w, sr, m)
                if args.no_qa or prev is None or "cer" not in prev or m["cer"] < prev["cer"]:
                    sf.write(cdir / f"{b['key']}.wav", w, sr)
                    meta_path(b).write_text(json.dumps(m, ensure_ascii=False, indent=1))
            redo = set()
        if args.no_qa:
            break
        # 2. проверка: куски без оценки оцениваем, плохие — в следующую попытку
        for b in uniq.values():
            m = meta(b)
            if "cer" not in m:
                w, sr = sf.read(cdir / f"{b['key']}.wav", dtype="float32")
                score(b, w, sr, m)
                meta_path(b).write_text(json.dumps(m, ensure_ascii=False, indent=1))
        todo = [b for b in uniq.values() if meta(b)["cer"] > args.cer]
        if not todo:
            break
        if attempt + 1 < args.tries:
            print(f"  не прошли проверку (CER > {args.cer}): {len(todo)} — попытка {attempt + 2}")
    if said:
        print(f"синтез: {time.time() - t0:.0f} c на {said:.0f} c речи")

    if not args.no_qa:
        cers = sorted(meta(b)["cer"] for b in uniq.values())
        bad = sorted((meta(b) for b in uniq.values() if meta(b)["cer"] > args.cer), key=lambda m: -m["cer"])
        print(f"проверка Whisper: медианный CER {cers[len(cers) // 2]:.3f}; выше {args.cer}: {len(bad)}")
        for m in bad:
            print(f"  {m['cer']:.3f}  ТЕКСТ: {m['text']}\n         ASR:   {m['hyp']}")

    # 3. длительности для narrated.voice(): текст реплики → секунды
    dfile = out / "durations.json"
    durations = json.loads(dfile.read_text()) if dfile.exists() else {}
    durations.update({b["text"]: meta(b)["dur"] for b in beats})
    dfile.write_text(json.dumps(durations, ensure_ascii=False, indent=1))
    print(f"durations.json: {len(durations)} реплик")
    if args.no_mix:
        return
    if args.only:
        print("сведение делается по всему ролику — запусти без --only")
        return

    # 4. сведение: длинный ролик — одна дорожка; рилсы — по дорожке на ролик из manim/<slug>/reels/
    sr = sf.info(cdir / f"{beats[0]['key']}.wav").samplerate
    if beats[0]["reel"]:
        jobs = [(r, [b for b in beats if b["reel"] == r], video_dir / "reels" / f"{r}.mp4", out / f"{r}.mp4")
                for r in dict.fromkeys(b["reel"] for b in beats)]
    else:
        jobs = [(None, beats, video_dir / f"{args.video}.mp4", out / f"{args.video}_{voice}.mp4")]
    report = []
    for reel, bs, video, final in jobs:
        if not video.exists():
            raise SystemExit(f"нет {video} — сначала собери ролик (build.py / build_reels.py)")
        chunks = [sf.read(cdir / f"{b['key']}.wav", dtype="float32")[0] for b in bs]
        track, rep = mix(bs, chunks, sr, bs[0]["total"] if reel else total, args.max_tempo)
        wav = out / (f"{reel}.wav" if reel else "voice.wav")
        sf.write(wav, track, sr)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-i", str(wav),
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", str(final)],
                       check=True)
        report += rep
        if reel:
            print(f"  {final.name}: {len(track) / sr:.1f} c")
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1))
    sped = [r for r in report if r["tempo"] > 1.001]
    lag = max(r["placed"] - r["start"] for r in report)
    stale = sum(not r["voiced"] for r in report)
    print(f"сведение: ускорено кусков {len(sped)}/{len(report)}, макс. отставание {lag:.1f} c"
          + (f"; {stale} кусков сняты не под голос — перерендери эти сцены" if stale else ""))
    print(f"готово: {jobs[0][3] if len(jobs) == 1 else out}")


if __name__ == "__main__":
    main()
