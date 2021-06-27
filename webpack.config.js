const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: process.env.PWD,
  entry: {
    main: './static/js/main.js',
    login: './static/js/login.js',
    signup: './static/js/signup.js',
  },
  output: {
    filename: '[name].min.js',
    path: path.join(process.env.PWD, 'public/js'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join('../css', '[name].min.css'),
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
};
