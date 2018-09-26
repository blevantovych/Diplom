import numpy as np
from sympy import simplify, lambdify, Symbol, symbols, latex, solve

def make_eq(coefs, point, f):
    x = Symbol('x')
    _f = lambdify(x, f)
    eq = _f(point)
    for i, c in enumerate(coefs):
        eq -= c*point**i
    return eq

def pol(alternance, error_on_iteration, degree, f, start, end): # start, end arguments are passed for continuous minmax spline
    x = Symbol('x')
    e = Symbol('e')
    vars_str = ' '.join(['a' + str(i) for i in range(degree+1)])
    variables = symbols(vars_str)
    eqs = []

    for i in range(degree+2):
        eqs.append(make_eq(variables, alternance[i], f) + e)
        e *= -1
    if degree % 2 == 1:
        e *= -1

    solution = solve(eqs, variables + (e,))

    error_on_iteration = solution[e]
    polynom = x - x
    for i, v in enumerate(variables):
        polynom += solution[v] * x**i

    return [polynom, error_on_iteration]

def max_error(func, start, end):
    x_vals = np.linspace(start, end, (end - start) * 1000)
    y_vals = func(x_vals)
    
    neg_err = min(y_vals)
    pos_err = max(y_vals)
    
    if abs(neg_err) > pos_err:
        e_max = neg_err
    else:
        e_max = pos_err
  
    i = list(y_vals).index(e_max)
    return [x_vals[i], e_max]

def error(polyn, f):
    x = Symbol('x')
    return np.vectorize(lambdify(x, f - polyn))

def sign(x):
    if x > 0: return '+'
    elif x < 0: return '-'
    else: return 0

sign = np.vectorize(sign)

def change_alternance(err_func, x_err, alternance, start, end):
    temp = alternance[:]
    temp.append(x_err)
    temp.sort()
    index_of_x_err = temp.index(x_err)
    if index_of_x_err != 0 and index_of_x_err != (len(temp)-1):
        if sign(err_func(temp[index_of_x_err])) == sign(err_func(temp[index_of_x_err-1])):
            del temp[index_of_x_err-1]
    
        else: del temp[index_of_x_err+1]
    elif index_of_x_err == 0:
        if sign(err_func(temp[index_of_x_err])) == sign(err_func(temp[1])):
            del temp[1]
        else:
            del temp[len(temp)-1]
    elif index_of_x_err == (len(temp)-1):
        if sign(err_func(temp[index_of_x_err])) == sign(err_func(temp[index_of_x_err-1])):
            del temp[index_of_x_err-1]
        else:
            del temp[0]

    return temp

def main(f_str, start, end, degree, precision, *args):
    f = simplify(f_str)
    x = Symbol('x')
    f_lamdified = np.vectorize(lambdify(x, f))
    error_on_iteration = 0
    # precision = 1e-2

    alternance = args[0] if len(args) > 0 else [start + (end-start) * k / float(degree + 1) for k in range(degree+2)]
    getPolynom = args[1] if len(args) > 1 else pol
    iterations = 1

    pol_err_on_iter = getPolynom(alternance, error_on_iteration, degree, f, start, end)
    polyn = pol_err_on_iter[0]
    polyn_lamdified = np.vectorize(lambdify(x, polyn))
    error_on_iteration = pol_err_on_iter[1]
    err_func = error(polyn, f)

    results = {}
    x_vals = np.linspace(start, end, (end - start) * 100)
    if (error_on_iteration == 0):
        [x_err, mErr] = max_error(err_func, start, end)
        return {'1': {
            "alternance": list(alternance),
            "err_in_each_point": list(err_func(alternance)),
            "max_err": float(mErr),
            "x_of_max_err": x_err,
            # "err_diff": float(abs(abs(mErr) - abs(error_on_iteration)) / abs(error_on_iteration)),
            "polynom_latex": latex(polyn),
            "error_plot": list([list(x_vals), list(err_func(x_vals))]),
            'max_err_in_error_plot': {
                'x': list([x_err, x_err]),
                'y': list(np.linspace(0, polyn_lamdified(x_err) - f_lamdified(x_err), 2))
            },
            "pol_plot": list([list(x_vals), list(polyn_lamdified(x_vals))]),
            "func_plot": list([list(x_vals), list(f_lamdified(x_vals))]) 
            }
        }
    else:
        while abs(abs(max_error(err_func, start, end)[1]) - abs(error_on_iteration)) / abs(error_on_iteration) > precision:
            [x_err, mErr] = max_error(err_func, start, end)
            results[str(iterations)] = {
                "alternance": list(alternance),
                "err_in_each_point": list(err_func(alternance)),
                "max_err": float(mErr),
                "x_of_max_err": x_err,
                "err_diff": float(abs(abs(mErr) - abs(error_on_iteration)) / abs(error_on_iteration)),
                "polynom_latex": latex(polyn),
                "error_plot": list([list(x_vals), list(err_func(x_vals))]),
                'max_err_in_error_plot': {
                    'x': list([x_err, x_err]),
                    'y': list(np.linspace(0, f_lamdified(x_err) - polyn_lamdified(x_err), 2))
                },
                "pol_plot": list([list(x_vals), list(polyn_lamdified(x_vals))])
            }

            alternance = change_alternance(err_func, x_err, alternance, start, end)
            iterations += 1
            pol_err_on_iter = getPolynom(alternance, error_on_iteration, degree, f, start, end)
            polyn = pol_err_on_iter[0]
            polyn_lamdified = np.vectorize(lambdify(x, polyn))
            # f_lamdified = np.vectorize(lambdify(x, f))
            error_on_iteration = pol_err_on_iter[1]

            err_func = error(polyn, f)

        [x_err, mErr] = max_error(err_func, start, end)
        results[str(iterations)] = {
            "alternance": list(alternance),
            "err_in_each_point": list(err_func(alternance)),
            "max_err": float(mErr),
            "x_of_max_err": x_err,
            "err_diff": float(abs(abs(mErr) - abs(error_on_iteration)) / abs(error_on_iteration)),
            "polynom_latex": latex(polyn),
            "error_plot": list([list(x_vals), list(err_func(x_vals))]),
            'max_err_in_error_plot': {
                'x': list([x_err, x_err]),
                'y': list(np.linspace(0, f_lamdified(x_err) - polyn_lamdified(x_err), 2))
            },
            "pol_plot": list([list(x_vals), list(polyn_lamdified(x_vals))]),
            "func_plot": list([list(x_vals), list(f_lamdified(x_vals))]) 
        }

        return results

# main('sin(x)', 1, 4, 2, 0.001)