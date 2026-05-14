Прежде чем работать с фреймворками, полезно один раз руками собрать нейросеть из numpy. Тогда становится понятно, что именно делает `optimizer.step()` под капотом.

## Один нейрон

Нейрон — это та же линейная регрессия, но с **нелинейностью** на выходе:

$$z = \mathbf{w}^T \mathbf{x} + b$$
$$a = \sigma(z)$$

Где $\sigma$ — функция активации. Возьмём сигмоиду:

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

Сигмоида сжимает любое число в интервал $(0, 1)$ — удобно для бинарной классификации.

## Задача: XOR

Классическая «hello world» задача, на которой линейная модель ломается. Таблица истинности:

| $x_1$ | $x_2$ | $y$ |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Один нейрон с этим не справится — нужна как минимум двухслойная сеть.

## Архитектура

- Вход: 2 числа.
- Скрытый слой: 2 нейрона, сигмоида.
- Выход: 1 нейрон, сигмоида.

$$h = \sigma(W_1 \mathbf{x} + b_1)$$
$$\hat{y} = \sigma(W_2 h + b_2)$$

Размерности: $W_1 \in \mathbb{R}^{2 \times 2}$, $b_1 \in \mathbb{R}^2$, $W_2 \in \mathbb{R}^{1 \times 2}$, $b_2 \in \mathbb{R}$.

## Прямой проход

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

Кеш `(X, z1, h, z2)` пригодится на обратном проходе.

## Функция ошибки

Для бинарной классификации берут **логистическую потерю** (binary cross-entropy):

$$L = -\frac{1}{n} \sum_i [y_i \log \hat{y}_i + (1 - y_i) \log(1 - \hat{y}_i)]$$

## Обратный проход (backpropagation)

Это самая важная часть. Мы хотим знать $\frac{\partial L}{\partial W_1}$, $\frac{\partial L}{\partial b_1}$, $\frac{\partial L}{\partial W_2}$, $\frac{\partial L}{\partial b_2}$ — чтобы шагнуть градиентным спуском.

Цепное правило раскручивается от конца к началу:

$$\frac{\partial L}{\partial z_2} = \hat{y} - y$$
$$\frac{\partial L}{\partial W_2} = \frac{\partial L}{\partial z_2} \cdot h^T$$
$$\frac{\partial L}{\partial h} = W_2^T \cdot \frac{\partial L}{\partial z_2}$$
$$\frac{\partial L}{\partial z_1} = \frac{\partial L}{\partial h} \odot \sigma'(z_1)$$
$$\frac{\partial L}{\partial W_1} = \frac{\partial L}{\partial z_1} \cdot X^T$$

Где $\sigma'(z) = \sigma(z)(1 - \sigma(z))$, а $\odot$ — поэлементное умножение.

### Код

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

## Сборка

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

Сеть выучила XOR.

## Что мы только что сделали

- Построили вычислительный граф.
- Прошли по нему вперёд — получили предсказание.
- Прошли назад — получили градиенты.
- Шагнули по градиенту — обновили веса.

PyTorch и TensorFlow делают то же самое, только автоматически и для произвольной топологии. Принцип не меняется.
