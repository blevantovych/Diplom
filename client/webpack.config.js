var debug = process.env.NODE_ENV !== 'production';
// var debug = false;
var webpack = require('webpack');
var path = require('path');

module.exports = {
  // context: path.join(__dirname, "src"),
  devtool: debug ? 'inline-sourcemap' : null,
  entry: ['./src/index.js'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: [
            'react-html-attrs',
            'transform-decorators-legacy',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['img-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    // contentBase: "./src",
    // hot: true
    host: '0.0.0.0',
    historyApiFallback: true
  },
  plugins: debug
    ? []
    : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          mangle: false,
          sourcemap: false
        })
      ]
};
