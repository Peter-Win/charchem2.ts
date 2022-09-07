const path = require('path');
const fs = require('fs');
const {CleanWebpackPlugin,} = require('clean-webpack-plugin');

// version update
try {
  const sver = fs.readFileSync(path.join(__dirname, "version.json"))
  const ver = JSON.parse(sver)
  if (Array.isArray(ver)) {
    const text = `export default [${ver.join(', ')}];`;
    fs.writeFileSync(path.join(__dirname, "src", "version.ts.tmp"), text)
  }
} catch (e) {
  console.error(e);
}

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
