import minmax

current_iteration = 0

# import redis
#
# r = redis.Redis(
#     host='localhost',
#     port=6379)


def getError(result):
    iterations = len(result)
    error = result[str(iterations)]["max_err"]
    return abs(error)


def shrinkInterval(interval, history=[]):
    [start, end] = interval
    if (start > end):
        print('Begining of interval is greater than its end')
        return
    left_boundaries = sorted(filter(lambda x: x < end, map(lambda x: x[1], history)))
    if len(left_boundaries) > 0:
        nearest_left_neighbor = left_boundaries[-1]
        delta = (end - nearest_left_neighbor) / 2.0
        return [start, end - delta]
    else:
        mid = (end - start) / 2.0
        return [start, start + mid]


def expandInterval(interval, history):
    [start, end] = interval
    if (start > end):
        print('Begining of interval is greater than its end')
        return
    if len(history) == 0:
        print('when expanding there should be history')
        return

    right_boundaries = sorted(filter(lambda x: x > end, map(lambda x: x[1], history)))
    if len(right_boundaries) > 0:
        nearest_right_neighbor = right_boundaries[0]
        delta = (nearest_right_neighbor - end) / 2.0
        return [start, end + delta]


def main(func, deg, start, end, precision, allowed_error, *args):

    interval = [start, end]
    historyOfIntervals = []
    splines = []

    def approximateMinmax(interval, current_iteration):
        if type(interval) is list:
            return minmax.main(
                f_str=func,
                start=interval[0],
                end=interval[1],
                degree=deg,
                precision=precision,
                current_iteration=current_iteration
            )

    approximate = args[0] if len(args) > 0 else approximateMinmax

    def make_approximation_on_one_segment(overallInterval):
        global current_iteration
        if not type(overallInterval) is list:
            # print(overallInterval)
            return


        print("current iteration: {}".format(current_iteration))
        result = approximate(overallInterval, current_iteration)
        max_error = getError(result)


        # print("Interval {}".format(overallInterval))

        # REDIS
        # r.publish('greetings', ' '.join(str(i) for i in overallInterval))

        # print("max_error: {} Interval {} history {}".format(max_error, overallInterval, historyOfIntervals))
        condition = abs(abs(max_error) - allowed_error)

        if condition > (allowed_error / 10):  # WHY 10 ????

            if (max_error > allowed_error):
                shrinkedInterval = shrinkInterval(overallInterval, historyOfIntervals)
                if len(historyOfIntervals) == 0:
                    historyOfIntervals.append(overallInterval)
                historyOfIntervals.append(shrinkedInterval)
                make_approximation_on_one_segment(shrinkedInterval)
            else:
                if overallInterval[1] != interval[1]:
                    expandedInterval = expandInterval(overallInterval, historyOfIntervals)
                    historyOfIntervals.append(expandedInterval)
                    make_approximation_on_one_segment(expandedInterval)
                else:
                    current_iteration += 1

                    splines.append({
                        "interval": overallInterval,
                        "spline": result,
                        "max_error": max_error
                    })
        else:
            splines.append({
                "interval": overallInterval,
                "spline": result,
                "max_error": max_error
            })
            current_iteration += 1

            if overallInterval[1] < interval[1]:
                historyOfIntervals[:] = []
                make_approximation_on_one_segment([overallInterval[1], interval[1]])


    make_approximation_on_one_segment(interval)
    return splines
