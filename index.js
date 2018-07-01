require('babel-register')({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});

const config = require('dotenv').config;

const result = config({
  path: `.env.${process.env.NODE_ENV}`,
});
if (result.error) {
  throw result.error;
}
// Setup global variables for server
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = (process.env.DISABLE_SSR === '1'); // Disable server side render here
global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__ROOT_SERVER_URL__ = process.env.ROOT_SERVER_URL;
global.__API_SERVER_URL__ = process.env.API_SERVER_URL;
global.__NOTIFICATION_SERVER_URL__ = process.env.API_SERVER_URL;

// This should be the same with webpack context
const dirRoot = require('path').join(process.cwd());
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

// Settings of webpack-isomorphic-tools
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./tools/webpack/WIT.config'))
  .server(dirRoot, () => {
    if (__DEV__) {
      require('./src/server');
    } else {
      require('./build/server');
    }
  });
