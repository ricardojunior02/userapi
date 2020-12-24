require('dotenv').config();
require('express-async-errors');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const AppError = require('./utils/AppError');



const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    error: 'error',
    message: 'Internal server Error',
  });
});

app.listen(process.env.URL_NODE, () => console.log(`SERVER RUNNING ON PORT ${process.env.URL_NODE}`))