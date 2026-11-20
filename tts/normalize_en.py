"""English narration → spoken form: numbers, signs and formula variables as words.

Qwen3-TTS reads English words and acronyms (LLM, CNN, RGB, ChatGPT) itself. Numbers are spelled out so
that "0.45", "−0.4", "1 048 576" and "16 × 16" come out the same every time; years (1900–2099) are spelled
the English way ("twenty twelve": as digits the model once read 2012 as "2000"); decades like "1970s" stay digits. Whisper writes numbers as digits, so CER runs both sides through here.
"""
import re

from num2words import num2words

TERMS = {"ŷ": "y hat", "ⁿ": " to the n", "²": " squared", "∇": "nabla ", "η": "eta"}
OPS = [("≈", " approximately "), ("≠", " is not equal to "), ("=", " equals "), ("→", ", "), ("·", " times "),
       ("%", " percent"), ("+", " plus "), ("⊃", " contains ")]


def num(s):
    s = re.sub(r"[\s,  ]", "", s)
    sign = "minus " if s[0] in "−-" else ""
    s = s.lstrip("−-")
    return sign + num2words(float(s) if "." in s else int(s), lang="en").replace("-", " ").replace(",", "")


def year(s):
    """2012 → twenty twelve: as digits the model once read 2012 as "2000"."""
    return num2words(int(s), lang="en", to="year").replace("-", " ")


def normalize(text):
    for k, v in TERMS.items():
        text = text.replace(k, v)
    # 2ⁿ was "2 to the n" above; formulas with a slash between letters: S / v → S over v
    text = re.sub(r"(?<=[A-Za-z)])\s*/\s*(?=[A-Za-z(])", " over ", text)
    # numbers with digit groups: 1 048 576, 1,500 (Whisper's style)
    text = re.sub(r"\b\d{1,3}(?:[  ,]\d{3})+\b(?!\.\d)", lambda m: num(m.group()), text)
    # multiplication between numbers or a number and a letter: 16 × 16 → by
    text = text.replace("×", " by ")
    # decimals and negatives
    text = re.sub(r"(?<![\w.])[−-]?\d+\.\d+\b", lambda m: num(m.group()), text)
    text = re.sub(r"(?<![\w])−\s?(\d+)", lambda m: num("-" + m.group(1)), text)
    text = text.replace(" − ", " minus ")
    # integers; 4-digit 19xx/20xx as years
    text = re.sub(r"\b\d+\b", lambda m: year(m.group()) if re.fullmatch(r"(19|20)\d\d", m.group()) else num(m.group()), text)
    for k, v in OPS:
        text = text.replace(k, v)
    return re.sub(r"\s{2,}", " ", text).replace(" ,", ",").replace(" .", ".").strip()


if __name__ == "__main__":
    import sys
    for line in sys.stdin:
        print(normalize(line.rstrip("\n")))
