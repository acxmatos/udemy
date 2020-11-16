const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');
const fs = require('fs');

const app = express();

fs.readFile('mongo_credentials.txt', 'utf8', (err, mongoAuthData) => {
  if (err) {
    console.error(
      'Unable to open mongo credentials file. Impossible to continue!'
    );
    process.exit(1);
  }

  // Remove newlines
  mongoAuthData = mongoAuthData.replace(/\r?\n|\r/g, '');

  const MONGO_URI = `mongodb+srv://${mongoAuthData}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
  console.log(MONGO_URI);

  // mongoose.Promise = global.Promise;
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection
      .once('open', () => console.log('Connected to Mongo Atlas instance.'))
      .on('error', error => console.log('Error connecting to Mongo Atlas:', error));
});

app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;
