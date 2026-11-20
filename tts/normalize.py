"""Перевод текста озвучки в «произносимый» вид: формулы, переменные, индексы, дроби и числа — словами.

Годы («в 2017 году», «1970-х») модель читает сама и согласует падеж лучше, чем num2words,
поэтому их не трогаем; остальные числа она путает («137» → «ценная на Т4, 100, 7»).
Английские слова (ReLU, softmax, PyTorch) и аббревиатуры (CPU) модель читает сама; переменные
(x, W₁, dW, w_ij, ∂L/∂w) — нет, их разворачиваем по-русски, как читают на лекции.
"""
import re

from num2words import num2words

TERMS = {
    "ChatGPT": "Чат Джи-Пи-Ти", "GPT": "Джи-Пи-Ти", "LLM": "эл-эл-эм", "CNN": "си-эн-эн",
    "MSE": "эм-эс-и", "RMSE": "эр-эм-эс-и", "ИИ": "И-И", "Transformer": "трансформер", "RGB": "эр-джи-би",
}
LETTERS = {
    "a": "а", "b": "бэ", "c": "цэ", "d": "дэ", "e": "е", "f": "эф", "g": "жэ", "h": "аш", "i": "и",
    "j": "жи", "k": "ка", "l": "эль", "m": "эм", "n": "эн", "o": "о", "p": "пэ", "q": "ку", "r": "эр",
    "s": "эс", "t": "тэ", "u": "у", "v": "вэ", "w": "дабл-ю", "x": "икс", "y": "игрек", "z": "зэт",
    "ŷ": "игрек с крышкой",
    "α": "альфа", "β": "бета", "γ": "гамма", "δ": "дельта", "ε": "эпсилон", "η": "эта", "θ": "тэта",
    "λ": "лямбда", "μ": "мю", "π": "пи", "σ": "сигма", "Σ": "сумма", "Δ": "дельта", "∇": "набла",
}
SUB = str.maketrans("₀₁₂₃₄₅₆₇₈₉ᵢⱼ", "0123456789ij")
SUP = {"²": " в квадрате", "³": " в кубе", "ᵀ": " транспонированная"}
OPS = {"=": " равно ", "≈": " примерно ", "≠": " не равно ", "/": " делить на ", "×": " на ", "·": " на ",
       "+": " плюс ", " − ": " минус ", "→": " — ", "←": " становится ", "%": " процентов"}
GREEK = "".join(k for k in LETTERS if not k.isascii())
TOKEN = re.compile(rf"(?<![A-Za-zА-Яа-яЁё_.])[A-Za-z{GREEK}][A-Za-z0-9{GREEK}₀-₉ᵢⱼ²³ᵀ_]*(?![A-Za-zА-Яа-яЁё(])")


def num(s):
    s = re.sub(r"\s", "", s)
    sign = "минус " if s[0] in "−-" else ""
    s = s.lstrip("−-")
    words = num2words(float(s.replace(",", ".")) if re.search(r"[.,]", s) else int(s), lang="ru")
    return sign + re.sub(r"^одна тысяча", "тысяча", words)


def is_word(tok):
    """Английское слово или аббревиатура, которую модель прочитает сама, — не переменная."""
    if "_" in tok and not re.fullmatch(r"[A-Za-z]_[A-Za-z0-9]+", tok):
        return True                                   # zero_grad — имя из кода
    if re.fullmatch(r"[A-Z]{2,}[a-z]*|[A-Z]?[a-z]{2,}[A-Za-z]*", tok) and re.search(r"[aeiouyAEIOUY]", tok):
        return True                                   # softmax, ReLU, PyTorch, CPU, RMSprop
    return bool(re.fullmatch(r"[A-Z]{3,}", tok))      # RNN, RLHF — по буквам, по-английски


def spell(tok):
    """Переменная из формулы: W₁ → «дабл-ю один», w_ij → «дабл-ю и жи», dW → «дэ дабл-ю»."""
    out = []
    for part in re.findall(rf"[A-Za-z{GREEK}]|\d+|[₀-₉]+|[ᵢⱼ]|[²³ᵀ]", tok.translate(SUB) if not re.search("[₀-₉]{2}", tok) else tok):
        if part in SUP:
            out.append(SUP[part].strip())
        elif part[0].isdigit() or part[0] in "₀₁₂₃₄₅₆₇₈₉":
            out.append(num(part.translate(SUB)))
        else:
            out.append(LETTERS.get(part.lower(), part))
    return " ".join(out)


def normalize(text):
    for k, v in TERMS.items():
        text = re.sub(rf"(?<![\w-]){k}(?![\w])", v, text)
    # частные производные: ∂L/∂w → «дэ эль по дэ дабл-ю»
    text = re.sub(r"∂(\S+?)\s*/\s*∂(\S+?)(?=[\s,.:;)]|$)", lambda m: f"дэ {spell(m.group(1))} по дэ {spell(m.group(2))}", text)
    text = text.replace("∂", "дэ ")
    # переменные и индексы — до чисел, чтобы «w2» не развалилось; «X·W₁» — по одной
    text = re.sub(r"(?<=\w)·(?=\w)", " · ", text)
    text = TOKEN.sub(lambda m: m.group() if is_word(m.group()) else spell(m.group()), text)
    # числа с разделителем разрядов: «1 048 576» → одно число
    text = re.sub(r"\b\d{1,3}(?:[  ]\d{3})+\b", lambda m: num(m.group()), text)
    # десятичные дроби и отрицательные числа
    text = re.sub(r"(?<![\w.,])[−-]?\d+[.,]\d+\b", lambda m: num(m.group()), text)
    text = re.sub(r"(?<![\w])−\s?(\d+)", lambda m: num("-" + m.group(1)), text)
    # целые, кроме годов
    text = re.sub(r"\b\d+\b(?!-х|\s+год)", lambda m: num(m.group()), text)
    for k, v in SUP.items():
        text = text.replace(k, v)
    for k, v in OPS.items():
        text = text.replace(k, v)
    return re.sub(r"\s{2,}", " ", text).replace(" ,", ",").replace(" .", ".").strip()


if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        print(normalize(line.rstrip("\n")))
