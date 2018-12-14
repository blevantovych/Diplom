from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
import numpy as np

import minmax
import discrete_minmax
import spline_with_specified_numbers_of_segments
import discrete_spline_minmax
import lssq
import spline_cont
import spline_minmax
import sys
import json
import copy
import time
import sentry_sdk
sentry_sdk.init("https://2bc1500c735e40c586593a05de1cab6f@sentry.io/1353830")

current_milli_time = lambda: int(round(time.time() * 1000))

app = Flask(__name__)
app.debug = True
CORS(app)


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

@app.route('/', methods=['GET'])
def hi():
    return render_template('hello.html')

@app.route('/continuous_spline_minmax', methods=['POST'])
def continuousSplineMinmax():
    data = json.loads(request.data)
    result = spline_cont.main(data['func'].replace('e', str(np.e)), data['deg'], data['start'], data['end'], data['precision'], data['allowed_error'])
    return jsonify(result)

@app.route('/minmax', methods=['POST'])
def min_max():
    data = json.loads(request.data)
    start = time.time()
    result = minmax.main(data['func'].replace('e', str(np.e)), data['start'], data['end'], data['deg'], data['precision'])
    end = time.time()

    result['1']['computation_time'] = end - start
    result['1']['precision'] = data['precision']
    return jsonify(result)

@app.route('/least_squares', methods=['POST'])
def least_squares():
    data = json.loads(request.data)
    input_data = data['func'] + '|' + \
                str(data['deg']) + '|' + \
                str(data['start']) + '|' +  \
                str(data['end']) + '|' + \
                str(data['points'])
    start = time.time()
    result = lssq.main(data['func'].replace('e', str(np.e)), data['deg'], data['start'], data['end'], data['points'])
    end = time.time()
    result['computation_time'] = end - start
    return jsonify(result)

@app.route('/least_squares_discrete', methods=['POST'])
def least_squares_discrete():
    data = json.loads(request.data)
    start = time.time()
    result = lssq.main_discrete(data['x_vals'], data['y_vals'], data['deg'])
    end = time.time()
    result['computation_time'] = end - start
    return jsonify(result)

@app.route('/minmax_discrete', methods=['POST'])
def minmax_discrete():
    data = json.loads(request.data)
    start = time.time()
    degree = data['deg']
    x_vals = data['x_vals']
    if (len(x_vals) < degree + 2):
        raise InvalidUsage('Insufficient points', status_code=400)

    result = discrete_minmax.main(x_vals, data['y_vals'], data['deg'], data['pinnedPoints'])
    end = time.time()
    result['1']['computation_time'] = end - start
    return jsonify(result)

@app.route('/spline_minmax', methods=['POST'])
def splineMinmax():
    data = json.loads(request.data)
    result = spline_minmax.main(data['func'].replace('e', str(np.e)), data['deg'], data['start'], data['end'], data['precision'], data['allowed_error'])
    return jsonify(result)

@app.route('/continuous_spline_minmax_segments_specified', methods=['POST'])
def splineMinmaxSegmentsSpecified():

    # print(request.data)
    data = json.loads(request.data)

    func = data['func'].replace('e', str(np.e))
    deg = data['deg']
    start = data['start']
    end = data['end']
    segments = data['segments']
    result = spline_with_specified_numbers_of_segments.main(func, deg, start, end, segments)
    return jsonify(result)

@app.route('/spline_minmax_discrete', methods=['POST'])
def splineMinmaxDiscrete():
    data = json.loads(request.data)
    # print data
    x_vals = data['x_vals']
    # # pinnedPoints = data['pinnedPoints']
    pinnedPoints = []
    result = discrete_spline_minmax.main(x_vals, data['y_vals'], data['deg'], pinnedPoints, data['allowed_error'])
    return jsonify(result)

@app.route('/foo')
def get_foo():
    raise InvalidUsage('This view is gone', status_code=410)

if __name__  == "__main__":
  app.run(host='0.0.0.0', port=5000, debug=True)
