const path = require('path');
const {CleanWebpackPlugin,} = require('clean-webpack-plugin');
module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'charchem.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3333,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts',
    ],
  },
};
