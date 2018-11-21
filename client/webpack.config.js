// var debug = process.env.NODE_ENV !== 'production';
const debug = false;
// const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  // context: path.join(__dirname, "src"),
  devtool: debug ? 'inline-sourcemap' : false,
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
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader'
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
  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ]
  }
};
