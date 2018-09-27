from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import numpy as np

import minmax
import discrete_minmax
import lssq
import spline_cont
import spline_minmax
import sys
import json
import copy
import time

app = Flask(__name__)
app.debug = True
CORS(app)

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
    result = discrete_minmax.main(data['x_vals'], data['y_vals'], data['deg'])
    end = time.time()
    result['1']['computation_time'] = end - start
    return jsonify(result)

@app.route('/spline_minmax', methods=['POST'])
def splineMinmax():
    data = json.loads(request.data)
    result = spline_minmax.main(data['func'].replace('e', str(np.e)), data['deg'], data['start'], data['end'], data['precision'], data['allowed_error'])
    return jsonify(result)

if __name__  == "__main__":
  app.run(host='0.0.0.0', port=5000)
