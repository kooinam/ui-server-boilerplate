'use strict'; // eslint-disable-line

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const BabiliPlugin = require('babili-webpack-plugin');

const { CSSModules, eslint } = require('./config');

module.exports = {
  name: 'server',
  target: 'node',
  externals: [nodeExternals({
    // Load non-javascript files with extensions, presumably via loaders
    whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
  })],
  devtool: 'cheap-module-source-map',
  context: path.join(process.cwd()),
  entry: { server: ['./src/server.js'] },
  output: {
    path: path.join(process.cwd(), './build'),
    publicPath: '/assets/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          {
            loader: 'css/locals',
            options: {
              modules: CSSModules,
              // "context" and "localIdentName" need to be the same with client config,
              // or the style will flick when page first loaded
              context: path.join(process.cwd(), './src'),
              localIdentName: '[hash:base64:5]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot|otf)$/,
        loader: 'url',
        options: { limit: 10000 },
      },
      {
        test: /\.tsx?$/,
        exclude: /templateme/,
        use: [{
          loader: 'babel-loader',
        }, {
          loader: 'ts-loader',
        }],
      },
    ],
  },
  plugins: [
    // new BabiliPlugin(),
    // Setup global variables for server
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  // Where to resolve our loaders
  resolveLoader: {
    modules: ['src', 'node_modules'],
    moduleExtensions: ['-loader'],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    descriptionFiles: ['package.json'],
    moduleExtensions: ['-loader'],
    extensions: ['.js', '.jsx', '.json', '.css', '.ts', '.tsx'],
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: true,
    __dirname: true,
  },
};
