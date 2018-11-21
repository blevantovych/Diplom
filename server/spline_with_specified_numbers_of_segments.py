import spline_cont

def main(func, deg, start, end, segments):
    precision = 0.01
    allowed_error = 0.1
    approximation = spline_cont.main(func, deg, start, end, precision, allowed_error)

    while len(approximation) != segments:
        print allowed_error
        if (len(approximation) < segments):
            allowed_error = allowed_error * 0.8
        else:
            allowed_error = allowed_error * 1.2

        approximation = spline_cont.main(func, deg, start, end, precision, allowed_error)

    return approximation