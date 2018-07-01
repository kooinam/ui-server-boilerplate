/* @flow */

import path from 'path';
import morgan from 'morgan';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import chalk from 'chalk';
import { expandRoutes, addAxiosPreferences } from 'awry-utilities-2';
import _ from 'lodash';
import bodyParser from 'body-parser';
import axios from 'axios';
import redis from 'redis';
import { CronJob } from 'cron';
import request from 'request';
import createHistory from 'history/createMemoryHistory';

import configureStore from './redux/store';
import ClientHtml from './utils/ClientHtml';
import ClientAppPage from './client_containers/AppPage';
import clientRoutes from './clientRoutes';
import AdminHtml from './utils/AdminHtml';
import AdminAppPage from './admin_containers/AppPage';
import adminRoutes from './adminRoutes';
import { port, host } from './config';
import { openSocket } from './io/socket';

const app = express();

// Using helmet to secure Express with various HTTP headers
app.use(helmet());
// Prevent HTTP parameter pollution.
app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
// Compress all requests
// app.use(compression());

// Use morgan for http request debug (only show error)
app.use(morgan('dev'));
app.use(favicon(path.join(process.cwd(), './build/public/favicon.ico')));
app.use(express.static(path.join(process.cwd(), './build/public')));

// Run express as webpack dev server
if (__DEV__) {
  const webpack = require('webpack');
  const webpackConfig = require('../tools/webpack/webpack.client.babel');

  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    noInfo: true,
    stats: 'errors-only',
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

const parseReq = (req, res, routes, Html, Container) => {
  if (__DEV__) webpackIsomorphicTools.refresh();

  const history = createHistory();
  const store = configureStore(history);
  const renderHtml = (store, htmlContent) => { // eslint-disable-line no-shadow
    const html = renderToStaticMarkup(<Html store={store} htmlContent={htmlContent} />);

    return `<!doctype html>${html}`;
  };

  // If __DISABLE_SSR__ = true, disable server side rendering
  if (__DISABLE_SSR__) {
    res.send(renderHtml(store));
    return;
  }

  // Load data on server-side
  const loadBranchData = (cache) => {
    const promises = [];

    expandRoutes(routes).some((route) => {
      const match = matchPath(req.url.split('?')[0], route);
      const query = (req.url.split('?').length > 1) ? req.url.split('?')[1] : '';
      // $FlowFixMe: the params of pre-load actions are dynamic
      if (match) {
        if (route.loadData) {
          promises.push(route.loadData(store.dispatch, match.params, query, cache));
        } else if (route.parentLoadData) {
          promises.push(route.parentLoadData(store.dispatch, match.params, query, cache));
        }

        let parentRoute = route.parentRoute;
        while (parentRoute) {
          const parentMatch = matchPath(req.url.split('?')[0], route);
          const parentQuery = (req.url.split('?').length > 1) ? req.url.split('?')[1] : '';

          if (parentMatch) {
            if (parentRoute.parentLoadData) {
              promises.push(parentRoute.parentLoadData(store.dispatch, parentMatch.params, parentQuery, cache));
            }

            parentRoute = parentRoute.parentRoute;
          } else {
            parentRoute = null;
          }
        }
      }

      return match;
    });

    return Promise.all(promises);
  };

  const cache = {};
  let redisClient = null;
  if (__DEV__) {
    redisClient = redis.createClient();
  } else {
    redisClient = redis.createClient({
      host: process.env.REDIS_URL,
      port: '6379',
      password: process.env.REDIS_PASSWORD,
    });
  }

  redisClient.get(`${process.env.API_SERVER_URL}-cache`, (err, obj) => {
    if (err) {
      redisClient.quit();
      res.status(404).send('Not Found :(');

      return;
    }
    let newObj = {};
    try {
      newObj = JSON.parse(obj);
    } catch(err) {

    }
    Object.assign(cache, newObj);
    redisClient.quit();

    // Send response after all the action(s) are dispathed
    loadBranchData(cache)
      .then(() => {
        // Setup React-Router server-side rendering
        const routerContext = {};
        const htmlContent = renderToString(
          <Provider store={store}>
            <StaticRouter location={req.url} context={routerContext}>
              <Container routes={routes} location={req.url.split('?')[0]} host={req.headers.host} />
            </StaticRouter>
          </Provider>,
        );

        // Check if the render result contains a redirect, if so we need to set
        // the specific status and redirect header and end the response
        if (routerContext.url) {
          res.status(301).setHeader('Location', routerContext.url);
          res.end();

          return;
        }

        // Checking is page is 404
        const status = routerContext.status === '404' ? 404 : 200;

        // Pass the route and initial state into html template
        res.status(status).send(renderHtml(store, htmlContent));
      })
      .catch((err) => {
        res.status(404).send('Not Found :(');
        console.log(err.stack);
        console.error(`==> 😭  Rendering routes error: ${err}`);
      });
  });
};

app.post('/subscribers.json', (req, res) => {
  let options = {
    prefix: process.env.API_SERVER_URL,
  };
  if (__DEV__) {

  } else {
    options = _.assign(options, {
      host: process.env.REDIS_URL,
      port: '6379',
      password: process.env.REDIS_PASSWORD,
    });
  }
  const redisClient = redis.createClient(options);

  // publish to subscribers channel with subscriber_ids
  _.each(req.body.subscriber_ids, (subscriber_id) => {
    redisClient.publish('subscribers', subscriber_id);
  });
  redisClient.quit();

  res.send('result=OK');
});

app.get('/admin', (req, res) => {
  res.format({
    'text/html': () => {
      parseReq(req, res, adminRoutes, AdminHtml, AdminAppPage);
    },
  });
});

app.get(/^\/admin\/[^.]*$/, (req, res) => {
  res.format({
    'text/html': () => {
      parseReq(req, res, adminRoutes, AdminHtml, AdminAppPage);
    },
  });
});

app.get(/^\/[^.]*$/, (req, res) => {
  res.format({
    'text/html': () => {
      const cookies = req.cookies || {};
      const token = cookies.token || '';

      // const apiServerURL = process.env.API_SERVER_URL;

      parseReq(req, res, clientRoutes, ClientHtml, ClientAppPage);
    },
  });
});

if (port) {
  const server = app.listen(port, host, (err) => {
    const url = `http://${host}:${port}`;

    if (err) console.error(`==> 😭  OMG!!! ${err}`);

    console.info(chalk.green(`==> 🌎  Listening at ${url}`));

    // Open Chrome
    require('../tools/openBrowser')(url);
  });
  openSocket(server);
} else {
  console.error(chalk.red('==> 😭  OMG!!! No PORT environment variable has been specified'));
}

