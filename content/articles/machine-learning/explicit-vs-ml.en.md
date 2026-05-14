Imagine you need to compute the distance a car has travelled. You have its speed and the time elapsed. This is the classic schoolbook problem with a one-line solution:

$$S = v \cdot t$$

The relationship between the inputs ($v$ and $t$) and the output ($S$) is fully known. You open your editor and write:

```python
def distance(velocity, time):
    return velocity * time
```

That's **explicit programming**. The rule is known — we write it down. The machine doesn't need to "learn" anything; everything is already in our code.

## When there is no formula

Now a different task: given a photograph, decide whether it shows a cat or a dog. No formula exists for this. You cannot write `if pixel[3][5] == "whiskers": return "cat"` — that's absurd.

This is where **machine learning** comes in. We don't write the rule. We show the model many input-output pairs and ask it to figure out the pattern itself.

### What "figure out the pattern" means

A model is a function with adjustable parameters. Going back to $S = v \cdot t$, if we *pretended* not to know the formula, we could propose this model:

$$\hat{S} = w_1 \cdot v + w_2 \cdot t + w_3 \cdot v \cdot t + b$$

where $w_1, w_2, w_3, b$ are parameters to be tuned. Show the model enough examples of the form `(v, t, S)` and it should find weights that make $\hat{S}$ close to the real $S$. Ideally it would converge to $w_1 = w_2 = b = 0$ and $w_3 = 1$ — recovering the original formula.

## The core difference

| Approach | What we give the machine | What the machine produces |
|---|---|---|
| Explicit programming | A rule | An answer |
| Machine learning | Examples (input, output) | A rule |

> **Note.** Machine learning is not magic. It's statistics, optimisation, and linear algebra, packaged so that an approximate rule "falls out" of data.

## When to use what

- If the rule is **known and stable** — write it explicitly. It's more reliable, faster, and easier to debug.
- If the rule is **unknown or too complex** to enumerate by hand (speech recognition, translation, recommendations) — reach for ML.

In the next article we'll look at *how* a model finds those weights, using linear regression as the running example.
