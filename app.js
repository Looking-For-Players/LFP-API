/* IMPORT DEPENDENCIES */
require('dotenv').config();
require('./config/db.config');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const passportConfig = require('./config/passport.config');
const session = require('./config/session.config');
const cors = require('./config/cors.config');
const {normalizePort} = require('./helpers/helpers');

/* CONFIG EXPRESS */
const app = express();
//app.use(cors);
app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(session);
//app.use(passportConfig);

/* Configure routes */
const router = require('./config/routes.js');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
  console.error('-' * 1000);
  console.error(error);

  res.status(error.status || 500);

  const data = {};

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400);

    for (let field of Object.keys(error.errors)) {
      error.errors[field] = error.errors[field].message;
    }

    data.errors = error.errors;
  } else if (error instanceof mongoose.Error.CastError) {
    error = createError(404, 'Resource not found');
  }

  data.message = error.message;
  res.json(data);
});

/* Listen on provided port */
const port = normalizePort(process.env.PORT);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Helper functions
