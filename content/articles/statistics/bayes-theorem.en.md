Bayes' theorem is one formula from probability theory that changes how you think about uncertainty. Let's walk through it with a concrete example.

## The formula

$$P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$$

Read it as: "the probability of $A$ given $B$ equals the probability of $B$ given $A$, times the prior probability of $A$, divided by the prior probability of $B$."

Sounds abstract. An example makes it concrete.

## Example: a medical test

A disease affects 1 person in 1000. The test for it:

- gives a positive result for a sick person 99% of the time (sensitivity);
- gives a positive result for a healthy person 5% of the time (false positive rate).

**Question:** your test came back positive. What is the probability that you actually have the disease?

Most people answer "99%". They are wrong. The correct answer is about **2%**.

### Why

Let:

- $D$ — "diseased".
- $T^+$ — "test is positive".

Given:

- $P(D) = 0.001$
- $P(T^+ \mid D) = 0.99$
- $P(T^+ \mid \neg D) = 0.05$

We want $P(D \mid T^+)$.

The marginal probability of a positive test:

$$P(T^+) = P(T^+ \mid D) P(D) + P(T^+ \mid \neg D) P(\neg D)$$
$$P(T^+) = 0.99 \cdot 0.001 + 0.05 \cdot 0.999 \approx 0.0510$$

Plug in:

$$P(D \mid T^+) = \frac{0.99 \cdot 0.001}{0.0510} \approx 0.0194$$

About 2%. Not 99%.

## Intuition: imagine 100,000 people

- Sick: 100.
- Healthy: 99,900.

Run the test on everyone:

- Of the 100 sick people, the test catches **99** (true positives).
- Of the 99,900 healthy people, the test falsely flags **4,995** (false positives).

Total positives: $99 + 4995 = 5094$. Actually sick among them: $99$.

$$\frac{99}{5094} \approx 0.0194$$

Same answer.

## What happened

A rare disease plus an imperfect test means most positive results are **false**. Even high sensitivity doesn't save you when the base rate is tiny.

> **That is Bayes' insight.** New evidence doesn't replace your prior — it *updates* it. The positive test raised your probability of disease from 0.1% to 2% — a 20× increase. But the absolute probability is still small.

## Where this matters

- **Spam filters.** Old-school Bayesian classifiers estimate $P(\text{spam} \mid \text{words})$.
- **Medical diagnostics.** Especially with multiple tests — each one updates the probability further.
- **A/B testing.** Bayesian methods answer "B is better than A with probability 87%" instead of mysterious p-values.
- **Machine learning.** Bayesian neural networks, Gaussian processes, variational inference — anywhere uncertainty matters.

## One-line summary

If you remember one thing: **the posterior is proportional to the likelihood times the prior.**

$$\underbrace{P(A \mid B)}_{\text{posterior}} \propto \underbrace{P(B \mid A)}_{\text{likelihood}} \cdot \underbrace{P(A)}_{\text{prior}}$$

The denominator $P(B)$ is just a normalising constant that makes the probabilities sum to one. All the intuition lives in the numerator.
