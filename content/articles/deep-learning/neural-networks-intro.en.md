Before reaching for a framework, it's worth assembling a neural network from raw numpy at least once. Then `optimizer.step()` stops being magic.

## A single neuron

A neuron is just linear regression with a **non-linearity** on the output:

$$z = \mathbf{w}^T \mathbf{x} + b$$
$$a = \sigma(z)$$

Where $\sigma$ is the activation function. Let's use the sigmoid:

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

The sigmoid squashes any number into the open interval $(0, 1)$ — convenient for binary classification.

## The task: XOR

The classic "hello world" that breaks linear models. Truth table:

| $x_1$ | $x_2$ | $y$ |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

A single neuron cannot solve this — you need at least a two-layer network.

## Architecture

- Input: 2 numbers.
- Hidden layer: 2 neurons, sigmoid.
- Output: 1 neuron, sigmoid.

$$h = \sigma(W_1 \mathbf{x} + b_1)$$
$$\hat{y} = \sigma(W_2 h + b_2)$$

Shapes: $W_1 \in \mathbb{R}^{2 \times 2}$, $b_1 \in \mathbb{R}^2$, $W_2 \in \mathbb{R}^{1 \times 2}$, $b_2 \in \mathbb{R}$.

## Forward pass

```python
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward(X, W1, b1, W2, b2):
    z1 = X @ W1.T + b1
    h  = sigmoid(z1)
    z2 = h @ W2.T + b2
    y_hat = sigmoid(z2)
    return y_hat, (X, z1, h, z2)
```

The cache `(X, z1, h, z2)` will be needed for the backward pass.

## Loss function

For binary classification we use the **logistic loss** (binary cross-entropy):

$$L = -\frac{1}{n} \sum_i [y_i \log \hat{y}_i + (1 - y_i) \log(1 - \hat{y}_i)]$$

## Backward pass (backpropagation)

This is the important bit. We want $\frac{\partial L}{\partial W_1}$, $\frac{\partial L}{\partial b_1}$, $\frac{\partial L}{\partial W_2}$, $\frac{\partial L}{\partial b_2}$ so we can take a gradient step.

The chain rule unwinds from output back to input:

$$\frac{\partial L}{\partial z_2} = \hat{y} - y$$
$$\frac{\partial L}{\partial W_2} = \frac{\partial L}{\partial z_2} \cdot h^T$$
$$\frac{\partial L}{\partial h} = W_2^T \cdot \frac{\partial L}{\partial z_2}$$
$$\frac{\partial L}{\partial z_1} = \frac{\partial L}{\partial h} \odot \sigma'(z_1)$$
$$\frac{\partial L}{\partial W_1} = \frac{\partial L}{\partial z_1} \cdot X^T$$

where $\sigma'(z) = \sigma(z)(1 - \sigma(z))$ and $\odot$ is element-wise multiplication.

### Code

```python
def backward(y, y_hat, cache, W2):
    X, z1, h, z2 = cache
    n = X.shape[0]

    dz2 = (y_hat - y) / n              # (n, 1)
    dW2 = dz2.T @ h                    # (1, 2)
    db2 = dz2.sum(axis=0)              # (1,)

    dh  = dz2 @ W2                     # (n, 2)
    dz1 = dh * h * (1 - h)             # sigmoid'(z1)
    dW1 = dz1.T @ X                    # (2, 2)
    db1 = dz1.sum(axis=0)              # (2,)

    return dW1, db1, dW2, db2
```

## Putting it together

```python
np.random.seed(0)
X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([[0],[1],[1],[0]], dtype=float)

W1 = np.random.randn(2, 2) * 0.5
b1 = np.zeros(2)
W2 = np.random.randn(1, 2) * 0.5
b2 = np.zeros(1)

lr = 1.0
for step in range(10000):
    y_hat, cache = forward(X, W1, b1, W2, b2)
    dW1, db1, dW2, db2 = backward(y, y_hat, cache, W2)
    W1 -= lr * dW1
    b1 -= lr * db1
    W2 -= lr * dW2
    b2 -= lr * db2

print(forward(X, W1, b1, W2, b2)[0].round(2))
# [[0.02] [0.98] [0.98] [0.02]]
```

The network has learned XOR.

## What we just did

- Built a computational graph.
- Walked it forward to get a prediction.
- Walked it backward to get gradients.
- Took a step along the gradient to update weights.

PyTorch and TensorFlow do exactly the same thing, just automatically and for arbitrary topologies. The principle doesn't change.
