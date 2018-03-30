
'use strict'; // eslint-disable-line

import { config } from 'dotenv';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const BabiliPlugin = require('babili-webpack-plugin');

const { CSSModules, eslint, stylelint, vendor } = require('./config');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./WIT.config')).development(isDev);

const result = config({
  path: `.env.${process.env.NODE_ENV}`,
});
if (result.error) {
  throw result.error;
}

// Setting the plugins for development/prodcution
const getPlugins = () => {
  // Common
  const plugins = [
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: true,
      disable: isDev, // Disable css extracting on development
      ignoreOrder: CSSModules,
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        // Javascript lint
        eslint: { failOnError: eslint },
        context: '/', // Required for the sourceMap of css/sass loader
        debug: isDev,
        minimize: !isDev,
      },
    }),
    // Setup enviorment variables for client
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    // Setup global variables for client
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `'"${(isDev) ? 'development' : 'production'}"'`,
      __CLIENT__: true,
      __SERVER__: false,
      __DEV__: isDev,
      __API_SERVER_URL__: `'${process.env.API_SERVER_URL}'`,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    webpackIsomorphicToolsPlugin,
    new webpack.ProvidePlugin({
      'window.Quill': 'quill',
    }),
  ];

  if (isDev) { // For development
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      // Prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),
      new webpack.IgnorePlugin(/webpack-stats\.json$/) // eslint-disable-line comma-dangle
    );
  } else {
    plugins.push( // For production
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity }),
      new webpack.optimize.ModuleConcatenationPlugin(),
    );
  }

  return plugins;
};

// Setting the entry for development/prodcution
const getEntry = () => {
  // For development
  let entry = {
    main: [
      'babel-polyfill', // Support promise for IE browser (for dev)
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      './src/client.js',
    ],
  };

  // For prodcution
  if (!isDev) {
    entry = {
      main: [
        'babel-polyfill',
        './src/client.js',
      ],
      // Register vendors here
      vendor,
    };
  }

  return entry;
};

// Setting webpack config
module.exports = {
  name: 'client',
  target: 'web',
  cache: isDev,
  devtool: isDev ? 'cheap-module-eval-source-map' : 'eval',
  context: path.join(process.cwd()),
  entry: getEntry(),
  output: {
    path: path.join(process.cwd(), './build/public/assets'),
    publicPath: '/assets/',
    // Don't use chunkhash in development it will increase compilation time
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
    pathinfo: isDev,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
        loader: 'babel',
        options: {
          cacheDirectory: isDev,
          babelrc: false,
          presets: [['es2015', { modules: false }], 'react', 'stage-0'],
          plugins: [['import', { libraryName: 'antd', style: 'css' }]],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {
              loader: 'css',
            },
            { loader: 'postcss', options: { sourceMap: true } },
          ],
        }),
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            {
              loader: 'css',
              options: {
                importLoaders: 2,
                sourceMap: true,
                modules: CSSModules,
                context: path.join(process.cwd(), './src'),
                localIdentName: isDev ? '[name]__[local].[hash:base64:5]' : '[hash:base64:5]',
                minimize: !isDev,
              },
            },
            { loader: 'postcss', options: { sourceMap: true } },
            {
              loader: 'sass',
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                sourceMapContents: !isDev,
                includePaths: ['src/theme'],
              },
            },
          ],
        }),
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot|otf)$/,
        loader: 'url-loader',
        options: { limit: 10000 },
      },
      {
        test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
        loader: 'imports?define=>false&this=>window',
      },
    ],
  },
  plugins: getPlugins(),
  // Where to resolve our loaders
  resolveLoader: {
    modules: ['src', 'node_modules'],
    moduleExtensions: ['-loader'],
  },
  resolve: {
    alias: {
      antd: path.resolve('./node_modules/antd'),
    },
    modules: ['src', 'node_modules'],
    descriptionFiles: ['package.json'],
    moduleExtensions: ['-loader'],
    extensions: ['.js', '.jsx', '.json', '.css'],
  },
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.github.io/docs/configuration.html#node
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    vm: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
