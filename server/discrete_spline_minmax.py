import discrete_minmax
import math

def getError(result):
  iterations = len(result)
  error = result[str(iterations)]["max_error"]
  return abs(error)


def shrinkInterval(interval, history = []):
  [start, end] = interval

  if end - start == 1:
      return [start, end]

  if (start > end):
    print('Beginning of interval is greater than its end')
    return
  left_boundaries = sorted(filter(lambda x: x < end, map(lambda x: x[1], history)))
  if len(left_boundaries) > 0:
    nearest_left_neighbor = left_boundaries[-1]
    delta = math.ceil((end - nearest_left_neighbor) / 2.0)
    return [int(start), int(end - delta)]
  else:
    mid = math.ceil((end - start) / 2.0)
    return [int(start), int(start + mid)]


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
    delta = math.ceil((nearest_right_neighbor - end) / 2.0)
    return [int(start), int(end + delta)]


def main(X, Y, deg, pinnedPoints, allowed_error, *args):
  # return discrete_minmax.main(X, Y, deg, pinnedPoints)

  interval = [0, len(X) - 1]
  historyOfIntervals = []
  splines = []

  def approximateMinmax(interval):
    if type(interval) is list:
      [start, end] = interval
      x_shrinked = X[start:end+1]
      y_shrinked = Y[start:end + 1]
      return discrete_minmax.main(x_shrinked, y_shrinked, deg, pinnedPoints)

  approximate = args[0] if len(args) > 0 else approximateMinmax

  def make_approximation_on_one_segment(overallInterval):
    print('overallInterval')
    print(overallInterval)
    if not type(overallInterval) is list:
      print(overallInterval)
      return
    result = approximate(overallInterval)
    max_error = getError(result)

    condition = abs(abs(max_error) - allowed_error)
    points = overallInterval[-1] - overallInterval[0] + 1

    if condition > (allowed_error / 10) and points > deg + 2: # WHY 10 ????

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
      if overallInterval[1] < interval[1]:
        historyOfIntervals[:] = []
        make_approximation_on_one_segment([overallInterval[1], interval[1]])

  make_approximation_on_one_segment(interval)
  return splines

X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
Y = [1.1, 0.9, 3.2, 4.5, 5.6, 6.7, 7.5, 8.4, 9.2, 10.2, 11.3, 12.4, 13.5, 14.1]
deg = 1
pinnedPoints = []


# print(len(main(X, Y, deg, pinnedPoints, 0.2)))
# mid_index = int(math.floor(len(X) / 2.0))
#
#
# print(mid_index)
#
#
# left_X = X[:mid_index]
# right_X = X[mid_index:]
#
# left_Y = Y[:mid_index]
# right_Y = Y[mid_index:]

# print(left_X)
# print(right_X)

# print(main(X, Y, deg, pinnedPoints)['1']['max_error'])

# def getMaxError (X, Y, deg, pinnedPoints):
#     approx = main(X, Y, deg, pinnedPoints)
#     iterations = list(map(lambda x: int(x), approx.keys()))
#     last_index = max(iterations)
#     print(approx[str(last_index)]['max_error'])

# getMaxError(X, Y, deg, pinnedPoints)
#
# getMaxError(left_X, left_Y, deg, pinnedPoints)
#
# getMaxError(right_X, right_Y, deg, pinnedPoints)
#

