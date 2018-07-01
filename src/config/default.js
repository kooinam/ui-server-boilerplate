module.exports = {
  host: process.env.NODE_HOST, // Define your host from 'package.json'
  port: process.env.NODE_PORT,
  app: {
    htmlAttributes: { lang: 'en' },
    titleTemplate: '%s - QUEST',
  },
};
