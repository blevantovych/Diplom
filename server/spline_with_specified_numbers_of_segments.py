import spline_cont
# import spline_minmax


def checkIfErrorsOk(specified_precision, approximation, epsilon=0.0001):
    for approx in approximation:
        print("max_error: {}, specified_precision: {}".format(approx["max_error"], specified_precision))
        print("e = {}".format(abs(approx["max_error"] - specified_precision) / specified_precision))
        if abs(specified_precision - approx["max_error"]) > epsilon:
            return False
    return True


def main(func, deg, start, end, r):
    mu_left = 0
    mu_right = 0
    prev_specified_precision = 0
    precision = 0.0009
    # mu = 0.01
    mu = 0.3

    # WHY only continuous spline ???
    # TODO: impletement non continuous also
    approximation = spline_cont.main(func, deg, start, end, precision, mu)
    k = len(approximation)
    while k != r or not checkIfErrorsOk(mu, approximation):
        if k > r:
            mu_left = mu
            if mu_right != 0:
                mu = (mu + mu_right) / 2
            else: mu *= 1.1

        if k <= r:
            mu_right = mu
            if mu_left != 0:
                mu = (mu + mu_left) / 2
            else:
                mu *= 0.9
        print("mu: {}, k: {}".format(mu, k))
        approximation = spline_cont.main(func, deg, start, end, precision, mu)

        if len(approximation) == r and abs(prev_specified_precision - mu) < 0.00000001:
            print '\n\n'
            print 'prev_specified_precision: {}'.format(prev_specified_precision)
            print 'mu: {}'.format(mu)
            print '\n\n'
            return approximation

        prev_specified_precision = mu

        for approx in approximation:
            print("max_error: {}".format(approx["max_error"]))
        k = len(approximation)

    return approximation

if __name__ == "__main__":
    main('2.712^x', 2, 0, 3, 3)[0]
