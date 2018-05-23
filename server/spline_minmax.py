import minmax

def getError(result):
  iterations = len(result)
  error = result[str(iterations)]["max_err"]
  return abs(error)

def shrinkInterval(interval, history = []):
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


def main(func, deg, start, end, precision, allowed_error):
  interval = [start, end]
  historyOfIntervals = []
  splines = []

  def approximate(interval):
    if type(interval) is list:
      return minmax.main(f_str=func, start=interval[0], end=interval[1], degree=deg, precision=precision)

  def make_approximation_on_one_segment(overallInterval):
    if not type(overallInterval) is list:
      print overallInterval
      return
    result = approximate(overallInterval)
    max_error = getError(result)
    print("max_error: {} Interval {} history {}".format(max_error, overallInterval, historyOfIntervals))
    condition = abs(abs(max_error) - allowed_error)

    if condition > 0.1:

      if (getError(result) > allowed_error):
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

# print main('sin(x)', deg=2, start=1, end=4, precision=0.1, allowed_error=0.001)