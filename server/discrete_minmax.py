import numpy as np
from sympy import simplify, lambdify, Symbol, symbols, latex, solve
import math

def make_eq(coefs, point, f_at_point):
    eq = f_at_point
    for i, c in enumerate(coefs):
        eq -= c*point**i
    return eq

def make_discrete_func(x_arr, y_arr):
    def f(x):
        if x in x_arr:
            index = x_arr.index(x)
            return y_arr[index]
        else: return None
    return f

def make_initial_alternance(x, degree):
    alternance = [x[0]] # add first
    busy = []
    for i in range(degree):
        rand_index = np.random.randint(1, len(x)-1)
        while rand_index in busy:
            rand_index = np.random.randint(1, len(x)-1)
        busy.append(rand_index)
        alternance.append(x[rand_index])
    alternance.append(x[len(x)-1]) # add last
    alternance.sort()
    return alternance

# t is alternance 
# erro_on_iterations is error on previous itertion
# degree is degree(order) of polynomial we trying to find
# f_discrete is function at discrete points
def pol(t, degree, f_discrete, X, pinnedPoints):
    print t
    x = Symbol('x')
    e = Symbol('e')
    vars_str = ' '.join(['a' + str(i) for i in range(degree+1)])
    variables = symbols(vars_str)
    
    left_hand_side = []
    right_hand_side = []
    for i in pinnedPoints:
        left_hand_side.append([0])

    for point in pinnedPoints:
        right_hand_side.append(f_discrete(point))

    # need to verify if degree+2 - len(pinnedPoint) is not less than 1 ()
    # Does 1 alternance point make sense?
    number_of_alternance_points = degree + 2 - len(pinnedPoints)
    for i in range(number_of_alternance_points):
        left_hand_side.append([])

    # print left_hand_side
    #  build first equation
    for eq_index, point in enumerate(pinnedPoints):
        for i in range(degree+1):
            left_hand_side[eq_index].append(point ** i)

    for i in range(number_of_alternance_points):
        left_hand_side[i + len(pinnedPoints)] = [1] if i % 2 == 0 else [-1]
        for j in range(degree + 1):
            left_hand_side[i + len(pinnedPoints)].append(t[i]**j)
        right_hand_side.append(f_discrete(t[i]))

    sol = np.linalg.solve(np.array(left_hand_side), np.array(right_hand_side))

    # eqs.append(make_eq(variables, X[0], f_discrete(X[0])))
    # for i in range(degree+1):
        # eqs.append(make_eq(variables, t[i+1], f_discrete(t[i+1])) + e)
        # e *= -1
    # if degree % 2 == 1:
    #     e *= -1

    # solution = solve(eqs, variables + (e,))

    # print 'eqs'
    # print eqs
    for i in range(number_of_alternance_points):
        if abs(sol[i]) < 1e-10:
            sol[i] = 0

    error_on_iteration = sol[0]
    polynom = x - x
    for i in range(degree+1):
        polynom += sol[i+1] * x**i

    return [polynom, error_on_iteration]

def max_error(func, x_vals):
    y_vals = func(x_vals)
    neg_err = min(y_vals)
    pos_err = max(y_vals)
    
    if abs(neg_err) > pos_err:
        e_max = neg_err
    else:
        e_max = pos_err
    return e_max

def x_of_max_error(func, x_vals):
    y_vals = func(x_vals)
    
    absolute_y_vals = list(map(lambda x: abs(x), y_vals))
    e_max = max(absolute_y_vals)

    i = list(absolute_y_vals).index(e_max)
    return x_vals[i]

# f is function at discrete points; created with make_discrete_func
# polyn is sympy expression returned from pol function
def error(pol_func, f):
    def err_func(x):
        return pol_func(x) - f(x)
    return np.vectorize(err_func)

def sign(x):
    if x > 0: return '+'
    elif x < 0: return '-'
    else: return 0

sign = np.vectorize(sign)

def change_alternance(err_func, alternance, x_vals):
    x_err = x_of_max_error(err_func, x_vals)
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

def main(X, Y, degree, pinnedPoints):
    if (len(X) < degree+2):
        print('Number of points is insufficient')
        raise ValueError('Number of points is insufficient')

    start = min(X)
    end = max(X)

    x_approx = np.linspace(start, end, 100)
    f = make_discrete_func(X, Y)
    
    x = Symbol('x')
    error_on_iteration = 0

    alternance = make_initial_alternance(X, degree)
    for i in range(len(pinnedPoints)):
        del alternance[i]
    iterations = 1

    pol_err_on_iter = pol(alternance, degree, f, X, pinnedPoints)
    polyn = pol_err_on_iter[0]
    polyn_lamdified = np.vectorize(lambdify(x, polyn))

    error_on_iteration = pol_err_on_iter[1]
    err_func = error(polyn_lamdified, f)
    x_err = float(x_of_max_error(err_func, X))
    result = {}
    result[str(iterations)] = { 
        'formula': latex(polyn),
        'x_vals': list(X),
        'y_vals': list(Y),
        "err_in_each_x": list(err_func(X)),
        "approximation_in_each_x": list(polyn_lamdified(X)),
        "err_in_each_point": list(err_func(alternance)),
        "alternance": list(alternance),
        "f_alternance": list(np.vectorize(f, otypes=[np.float])(alternance)),
        'x_approx': list(x_approx),
        'approximation': list(polyn_lamdified(x_approx)),
        'max_error': float(max_error(err_func, X)),
        'error_plot': list([list(X), list(err_func(X))]),
        'x_error': x_err,
        'max_err_in_error_plot': {
            'x': list([x_err, x_err]),
            'y': list(np.linspace(0, polyn_lamdified(x_err) - f(x_err), 2))
        },
        'max_error_line': {
            'x': [x_err for i in range(100)],
            'y': list(np.linspace(polyn_lamdified(x_err), f(x_err), 100))
        }
    }
    x_err_prev = 0
    iterations+=1
    while x_err != x_err_prev:
        alternance = change_alternance(err_func, alternance, X)
        pol_err_on_iter = pol(alternance, degree, f, X, pinnedPoints)
        polyn = pol_err_on_iter[0]
        polyn_lamdified = np.vectorize(lambdify(x, polyn))
        error_on_iteration = pol_err_on_iter[1]
        err_func = error(polyn_lamdified, f)
        x_err_prev = x_err
        x_err = float(x_of_max_error(err_func, X))

        result[str(iterations)] = {
            'formula': latex(polyn),
            'x_vals': list(X),
            'y_vals': list(Y),
            "err_in_each_x": list(err_func(X)),
            "approximation_in_each_x": list(polyn_lamdified(X)),
            "err_in_each_point": list(err_func(alternance)),
            "alternance": list(alternance),
            "f_alternance": list(np.vectorize(f, otypes=[np.float])(alternance)),
            'x_approx': list(x_approx),
            'approximation': list(polyn_lamdified(x_approx)),
            'max_error': float(max_error(err_func, X)),
            'error_plot': list([list(X), list(err_func(X))]),
            'max_err_in_error_plot': {
                'x': list([x_err, x_err]),
                'y': list(np.linspace(0,  polyn_lamdified(x_err) - f(x_err), 2))
            },
            'x_error': x_err,
            'max_error_line': {
                'x': [x_err for i in range(100)],
                'y': list(np.linspace(polyn_lamdified(x_err), f(x_err), 100))
            }
        }
        iterations+=1
    # print iterations
    return result
    # return iterations

# X = [0.1, 1, 2, 3,  4,  5,  6,  8,  10, 12, 16, 20, 25, 30, 35, 40, 45, 50 ]

# Y = [0.77, 7.68, 15.34, 22.96, 30.55, 38.11, 45.63, 60.55, 75.31, 89.89, 118.49, 146.26, 179.75, 211.8, 242.39, 271.53, 299.25, 325.6]
# iters = []
# for i in range(100):
#     iters.append(main(X, Y, 3))
# print iters
# print(float(sum(iters)) / len(iters))

# 5.58
# iters = [6, 6, 8, 6, 6, 5, 6, 6, 8]

# perfect alternancee for Book1.csv
#303.5000000	314.4000000	328.3000000	352.7000000	378.9000000
    # if (error_on_iteration == 0):
    #     mErr = max_error(err_func, x_vals)
    #     return {'1': {
    #         "alternance": list(alternance),
    #         "err_in_each_point": list(err_func(alternance)),
    #         "max_err": float(mErr),
    #         "x_of_max_err": x_of_max_error(err_func, start, end),
    #         # "err_diff": float(abs(abs(mErr) - abs(error_on_iteration)) / abs(error_on_iteration)),
    #         "polynom_latex": latex(polyn),
    #         "error_plot": list([list(x_vals), list(err_func(x_vals))]),
    #         "pol_plot": list([list(x_vals), list(polyn_lamdified(x_vals))]),
    #         "func_plot": list([list(x_vals), list(f_lamdified(x_vals))]) 

    #         }
    #     }
    # else:
    #     while abs(abs(max_error(err_func, start, end)) - abs(error_on_iteration)) / abs(error_on_iteration) > precision:
    #         mErr = max_error(err_func, start, end)
    #         results[str(iterations)] = {
    #             "alternance": list(alternance),
    #             "err_in_each_point": list(err_func(alternance)),
    #             "max_err": float(mErr),
    #             "x_of_max_err": x_of_max_error(err_func, start, end),
    #             "err_diff": float(abs(abs(mErr) - abs(error_on_iteration)) / abs(error_on_iteration)),
    #             "polynom_latex": latex(polyn),
    #             "error_plot": list([list(x_vals), list(err_func(x_vals))]),
    #             "pol_plot": list([list(x_vals), list(polyn_lamdified(x_vals))])
    #         }


    #         alternance = change_alternance(err_func, alternance, start, end)
    #         iterations += 1
    #         pol_err_on_iter = pol(alternance, error_on_iteration, degree, f)
    #         polyn = pol_err_on_iter[0]
    #         polyn_lamdified = np.vectorize(lambdify(x, polyn))
    #         # f_lamdified = np.vectorize(lambdify(x, f))
    #         error_on_iteration = pol_err_on_iter[1]

    #         err_func = error(polyn, f)

    #     mErr = max_error(err_func, start, end)
    #     results[str(iterations)] = {
    #         "alternance": list(alternance),
    #         "err_in_each_point": list(err_func(alternance)),
    #         "max_err": float(mErr),
    #         "x_of_max_err": x_of_max_error(err_func, start, end),
    #         "err_diff": float(abs(abs(mErr) - abs(error_on_iteration)) / abs(error_on_iteration)),
    #         "polynom_latex": latex(polyn),
    #         "error_plot": list([list(x_vals), list(err_func(x_vals))]),
    #         "pol_plot": list([list(x_vals), list(polyn_lamdified(x_vals))]),
    #         "func_plot": list([list(x_vals), list(f_lamdified(x_vals))]) 
    #     }



# print main('sin(x)+cos(x)', -5, 5, 2, 0.01)
# f_str, start, end, degree, precision

    # for example
    # x = [1, 2, 3, 4, 5, 6, 7, 8] degree = 3
    # what alternance should look like?
    # first of all there should be 5 points in alternance
    # i think this is ok [1, 3, 5, 7, 8]

    # x = [1, 2, 3, 4, 5, 6, 7] degree = 3
    # what alternance should look like?
    # first of all there should be 5 points in alternance
    # i think this is ok [1, 3, 5, 7, 8]
    
    # i think to choose first and last and rest randomly



# [(1, 1.1), (2.1, 2.03), (2.2, 2.31), (3.4, 3.2),(4.1, 4.0), (5.1, 4.94), (5.6, 5.5),(7.1, 7.0)]

# X = [0, 0.375, 0.875, 1.25, 1.625, 2.125, 2.625, 3, 3.5, 4, 4.563, 5.125, 5.875, 7.063, 8.938, 12.375, 23.625, 63]
# Y = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7]

# print (main(X, Y, 2, []))

# X = [0, 1, 3.1, 6, 10]
# Y = [0, 2, 4, 10, 20]
# print(main(X, Y, 2, []))