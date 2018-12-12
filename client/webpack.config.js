const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, {mode}) => ({
  // context: path.join(__dirname, "src"),
  devtool: mode === 'development' ? 'inline-sourcemap' : false,
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
    path: __dirname + '/build',
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: mode === 'development' ? '/' : '/Diplom/'
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(mode === 'production')
    })
  ]
});
