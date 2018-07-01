/* @flow */

import React from 'react';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import _ from 'lodash';

import type { Store } from '../types';

type Props = { store: Store, htmlContent?: string };

const Html = ({ store, htmlContent }: Props) => {
  // Should be declared after "renderToStaticMarkup()" of "../server.js" or it won't work
  const head = Helmet.renderStatic();
  const attrs = head.htmlAttributes.toComponent();
  const { lang, ...rest } = attrs || {};
  const assets = webpackIsomorphicTools.assets();

  const blurFocusScript = `
    document.body.addEventListener('click', eventFunction, false);
    //event function
    function eventFunction(e)
    {
      if (e.target.nodeName === 'A' || e.target.nodeName === 'BUTTON') {
        e.target.blur();
      } else if (e.target.nodeName === 'SPAN') {
        e.target.parentElement.blur();
      }
    }
  `;
  return (
    <html {...rest} lang={lang || 'en'}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico?v=4" />
        {head.title.toComponent()}
        {head.base.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {/* Styles will be presented in production with webpack extract text plugin */}
        {/* Styles will be presented in development mode */}
        {/* I put all of the styles here to smoothen the flick */}
        {
          _.keys(assets.styles).length === 0 ?
            _.keys(assets.assets).map(asset =>
              (
                <style
                  key={_.uniqueId()}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html:
                    // $FlowFixMe: It's not an issue
                    // eslint-disable-next-line import/no-dynamic-require
                    require(`../../${asset}`)._style,
                  }}
                />
              ),
            )
            : ['vendor', 'client'].map(style => (
              <link
                key={_.uniqueId()}
                href={assets.styles[style]}
                media="screen, projection"
                rel="stylesheet"
                type="text/css"
              />
            ))
        }
      </head>
      <body className="body">
        <div
          id="react-view"
          // Rendering the route, which passed from server-side
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
        />

        <script
          // Store the initial state into window
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: store && `window.__INITIAL_STATE__=${serialize(store.getState())};`,
          }}
        />
        {
          // Reverse the order of scripts for accessing vendor.js first
          ['client', 'vendor'].reverse().map(script =>
            <script key={_.uniqueId()} src={assets.javascript[script]} />,
          )
        }
        {head.script.toComponent()}
        <script
          dangerouslySetInnerHTML={{
            __html: blurFocusScript,
          }}
        />
      </body>
    </html>
  );
};

Html.defaultProps = { htmlContent: '' };

export default Html;
