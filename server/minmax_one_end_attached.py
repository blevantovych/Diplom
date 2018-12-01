import numpy as np
from sympy import simplify, lambdify, Symbol, symbols, latex, solve
import minmax


def pol(alternance, error_on_iteration, degree, f, start, end):
    x = Symbol('x')
    e = Symbol('e')
    vars_str = ' '.join(['a' + str(i) for i in range(degree + 1)])
    variables = symbols(vars_str)
    eqs = []

    eqs.append(minmax.make_eq(variables, start, f))
    for i in range(degree + 1):
        eqs.append(minmax.make_eq(variables, alternance[i], f) + e)
        e *= -1

    if degree % 2 == 1:
        e *= -1

    solution = solve(eqs, variables + (e,))
    error_on_iteration = solution[e]
    polynom = x - x
    for i, v in enumerate(variables):
        polynom += solution[v] * x ** i

    return [polynom, error_on_iteration]


def main(f_str, start, end, degree, precision):
    alternance = [start + (end - start) * k / float(degree + 1) for k in range(degree + 2)]
    del alternance[0]
    return minmax.main(f_str, start, end, degree, precision, alternance, pol)
