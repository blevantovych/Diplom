import numpy as np
from sympy import simplify, lambdify, Symbol, latex, Matrix

x = Symbol('x')


# genFuncs(5) => [x**5, x**4, x**3, x**2, x, 1]
# genFuncs(1) => [x, 1]
# genFuncs(0) => [1]
def genFuncs(deg):
    x = Symbol('x')
    funcs = []
    for i, el in enumerate(range(deg + 1)):
        funcs.append(x ** i)
    return funcs[::-1]


# makePol([1,2,-1,4]) => x**3 + 2*x**2 - x + 4
def makePol(coefs):
    deg = len(coefs) - 1
    x = Symbol('x')
    expr = coefs[0]
    for i, el in enumerate(range(deg)):
        expr = expr * x + coefs[i + 1]
    return expr.expand()


def max_error(f, a, b):  # f is sympy expression
    _f = np.vectorize(lambdify(x, f))
    x_vals = np.linspace(a, b, (b - a) * 10000)  # x values to check for
    y_vals = _f(x_vals)

    neg_err = min(y_vals)
    pos_err = max(y_vals)

    if abs(neg_err) > pos_err:
        e_max = neg_err
    else:
        e_max = pos_err
    return e_max


def x_of_max_error(f, a, b):
    _f = np.vectorize(lambdify(x, f))
    x_vals = np.linspace(a, b, (b - a) * 10000)  # x values to check for maximum
    y_vals = _f(x_vals)

    absolute_y_vals = list(map(lambda x: abs(x), y_vals))
    e_max = max(absolute_y_vals)

    i = list(absolute_y_vals).index(e_max)  # index of max error
    return x_vals[i]


# lssq valid for discrete case also
def lssq(x_vals, y_vals, deg):
    f = genFuncs(deg)
    A = []
    B = Matrix(y_vals)
    for i in x_vals:
        A.append(list(map(lambda el: el.subs(x, i), f)))
    A = Matrix(A)
    # pprint(A)
    # pprint((A.T*A))
    # pprint(A.T*B)
    return ((A.T * A).inv() * (A.T * B)).T


def main(fun, degree, start, end, points_ctn):
    f = np.vectorize(lambdify(x, simplify(fun)))

    x_vals = np.linspace(start, end, points_ctn)
    y_vals = f(x_vals)

    approximation = makePol(list(lssq(x_vals, y_vals, degree)))
    f_approx = np.vectorize(lambdify(x, simplify(approximation)))

    x_approx = np.linspace(start, end, 100)
    error_func = approximation - simplify(fun)
    err = max_error(approximation - simplify(fun), start, end)
    x_err = x_of_max_error(error_func, start, end)

    return {
        'formula': latex(approximation),
        'x_vals': list(x_vals),
        'y_vals': list(y_vals),
        'f_x_approx': list(f(x_approx)),
        'x_approx': list(x_approx),
        'approximation': list(f_approx(x_approx)),
        'max_error': err,
        'x_of_max_error': x_err,
        'y_error_plot': list(np.linspace(0, err, 2)),
        'error_plot': {
            'x': list(x_approx),
            'y': list(np.vectorize(lambdify(x, error_func))(x_approx))
        },
        'max_error_line': {
            'x': [x_err, x_err],
            'y': list(np.linspace(f_approx(x_err), f(x_err), 2))
        }
    }


def main_discrete(x_vals, y_vals, degree):
    start = min(x_vals)
    end = max(x_vals)

    approximation = makePol(list(lssq(x_vals, y_vals, degree)))
    f_approx = np.vectorize(lambdify(x, simplify(approximation)))

    x_approx = np.linspace(start, end, 100)

    # x_err = x_of_max_error(approximation - simplify(fun), start, end)
    errors = f_approx(x_vals) - y_vals
    print(errors)
    err_pos = max(errors)
    err_neg = min(errors)
    err = err_pos if abs(err_pos) > abs(err_neg) else err_neg
    x_err = x_vals[list(errors).index(err)]

    return {
        'formula': latex(approximation),
        'x_vals': list(x_vals),
        'y_vals': list(y_vals),
        'max_error': err,
        'x_error': x_err,
        'x_approx': list(x_approx),
        'approximation': list(f_approx(x_approx)),
        'error_plot': {
            'x': list(x_vals),
            'y': list(errors)
        },
        'max_error_line': {
            'x': [x_err, x_err],
            'y': list(np.linspace(f_approx(x_err), y_vals[list(errors).index(err)], 2))
        }
    }

# print main_discrete([1.2, 2.3, 3.0, 3.8, 4.7, 5.9], [1.1, 2.1, 3.1, 4.0, 4.9, 5.9], 1)

# return {
#     'formula': latex(N(sum(coef*x**i for i, coef in enumerate(reversed(p.coeffs))),4)),
#     'max_pos_err': max(f(x_vals) - p(x_vals)),
#     'max_neg_err': min(f(x_vals) - p(x_vals))
#     }


# def least_squares(fun, degree, start, end):
#     f = np.vectorize(lambdify(x, simplify(fun)))
#     x_ = np.linspace(start, end, 10000)
#
#     z = np.polyfit(x_, f(x_), degree)
#     p = np.poly1d(z)
#
#     x_vals = np.linspace(start, end, 10000) #values to check for max error
# a = matrix([['0.1','0.3'], ['7.1','5.5'],['3.2','4.4']], force_type=mpi)
