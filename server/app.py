from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import numpy as np

import minmax
import discrete_minmax
import lssq

import sys
import json
import copy
import time
current_milli_time = lambda: int(round(time.time() * 1000))

# from pymongo import MongoClient
# client = MongoClient("mongodb://localhost:27017")
# client = MongoClient("mongodb://chat:17081996@ds129651.mlab.com:29651/chat")
# db = client.chat

app = Flask(__name__)
CORS(app)

@app.route('/minmax', methods=['POST'])
def min_max():
    data = json.loads(request.data)
    # input_data = data['func'] + '|' + \
    #                 str(data['deg']) + '|' + \
    #                 str(data['start']) + '|' +  \
    #                 str(data['end']) + '|' + \
    #                 str(data['precision'])
    # cursor = db.minmax.find({'input': input_data}, {'_id': False, 'time': False, 'input': False})
    # if cursor.count() > 0:
    #     return jsonify(cursor[0])

    start = time.time()
    result = minmax.main(data['func'].replace('e', str(np.e)), data['start'], data['end'], data['deg'], data['precision'])
    end = time.time()

    result['1']['computation_time'] = end - start
    result['1']['precision'] = data['precision']
    # goesToDB = result.copy()
    # goesToDB['time'] = current_milli_time()
    # goesToDB['input'] = input_data
    # db.minmax.insert_one(goesToDB)
    return jsonify(result)

@app.route('/least_squares', methods=['POST'])
def least_squares():
    data = json.loads(request.data)
    input_data = data['func'] + '|' + \
                str(data['deg']) + '|' + \
                str(data['start']) + '|' +  \
                str(data['end']) + '|' + \
                str(data['points'])
    
    # cursor = db.least_squares.find({'input': input_data}, {'_id': False, 'time': False, 'input': False})
    # if cursor.count() > 0:
    #     return jsonify(cursor[0])

    start = time.time()
    result = lssq.main(data['func'].replace('e', str(np.e)), data['deg'], data['start'], data['end'], data['points'])
    end = time.time()
    result['computation_time'] = end - start

    # goesToDB = result.copy()
    # goesToDB['time'] = current_milli_time()
    # goesToDB['input'] = input_data

    # db.least_squares.insert_one(goesToDB)
    return jsonify(result)

@app.route('/least_squares_discrete', methods=['POST'])
def least_squares_discrete():
    data = json.loads(request.data)
    # cursor = db.least_squares_discrete.find({'$and': [
    #         {'input.x_vals': data['x_vals']},
    #         {'input.y_vals': data['y_vals']},
    #         {'input.deg': data['deg']}
    #     ]},
    #     {'_id': False, 'time': False, 'input': False})

    # if cursor.count() > 0:
    #     return jsonify(cursor[0])

    start = time.time()
    result = lssq.main_discrete(data['x_vals'], data['y_vals'], data['deg'])
    end = time.time()
    result['computation_time'] = end - start
    # input_data = {
    #     'x_vals': data['x_vals'],
    #     'y_vals': data['y_vals'],
    #     'deg': data['deg']
    # }

    # goesToDB = result.copy()
    # goesToDB['time'] = current_milli_time()
    # goesToDB['input'] = input_data

    # db.least_squares_discrete.insert_one(goesToDB)
    return jsonify(result)

@app.route('/minmax_discrete', methods=['POST'])
def minmax_discrete():
    data = json.loads(request.data)

    # cursor = db.minmax_discrete.find({'$and': [
    #         {'input.x_vals': data['x_vals']},
    #         {'input.y_vals': data['y_vals']},
    #         {'input.deg': data['deg']}
    #     ]},
    #     {'_id': False, 'time': False, 'input': False})

    # if cursor.count() > 0:
    #     return jsonify(cursor[0])

    start = time.time()
    result = discrete_minmax.main(data['x_vals'], data['y_vals'], data['deg'])
    end = time.time()
    result['1']['computation_time'] = end - start

    # input_data = {
    #     'x_vals': data['x_vals'],
    #     'y_vals': data['y_vals'],
    #     'deg': data['deg']
    # }

    # goesToDB = result.copy()
    # goesToDB['time'] = current_milli_time()
    # goesToDB['input'] = input_data
    # db.minmax_discrete.insert_one(goesToDB)
    return jsonify(result)
        
@app.route('/minmax_discrete_get_results', methods=['GET'])
def minmax_discrete_get_results():
    result = []
    for item in db.minmax_discrete.find({}, {'_id': False}):
        result.append(item)
    return jsonify(result) 

@app.route('/least_squares_discrete_get_results', methods=['GET'])
def least_squares_discrete_get_results():
    result = []
    for item in db.least_squares_discrete.find({}, {'_id': False}):
        result.append(item)
    return jsonify(result) 

@app.route('/minmax_get_results', methods=['GET'])
def minmax_get_results():
    result = []
    for item in db.minmax.find({}, {'_id': False}):
        result.append(item)
    return jsonify(result) 

@app.route('/least_squares_get_results', methods=['GET'])
def least_squares_get_results():
    result = []
    for item in db.least_squares.find({}, {'_id': False}):
        result.append(item)
    return jsonify(result) 

if __name__  == "__main__":
    app.run(debug=True)
