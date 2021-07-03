const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: process.env.PWD,
  entry: {
    subjects: {
      import: './static/prebuild/subjects.pre.js',
      filename: 'subjects.min.js',
    },
    topics: {
      import: './static/prebuild/topics.pre.js',
      filename: 'topics.min.js',
    },
  },
  output: {
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
