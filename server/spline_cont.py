import minmax_modified
import spline_minmax

def main(func, deg, start, end, precision, allowed_error):
  def approximate(interval):
    if type(interval) is list:
      return minmax_modified.main(f_str=func, start=interval[0], end=interval[1], degree=deg, precision=precision)

  return spline_minmax.main(func, deg, start, end, precision, allowed_error, approximate)
