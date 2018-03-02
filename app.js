/**
 * App - The express server
 * @module app
 */
'use strict';
const express = require('express');
const addRoutes = require('./routes');
const app = express();

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
};
const globalHeaders = (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
};
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (app.get('env') === 'development') {
  app.use(cors);
}
app.use(globalHeaders);

// Add all routes
addRoutes(app);

module.exports = app;