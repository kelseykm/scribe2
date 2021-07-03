const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
  context: process.env.PWD,
  entry: {
    login: {
      import: './static/js/login.js',
      filename: 'login.min.js',
    },
    signup: {
      import: './static/js/signup.js',
      filename: 'signup.min.js',
    },
    notFound: {
      import: './static/js/notFound.js',
      filename: 'notFound.min.js',
    },
  },
  output: {
    path: path.join(process.env.PWD, 'public/js'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join('../css', '[name].min.css'),
    }),
    new MergeIntoSingleFilePlugin({
      files: [
        {
          src: [
            './static/js/common.js', './static/js/subjects.js'
          ],
          dest: '../../static/prebuild/subjects.pre.js'
        },
        {
          src: [
            './static/js/common.js', './static/js/topics.js'
          ],
          dest: '../../static/prebuild/topics.pre.js'
        },
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
}
