const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { post } = require('./src');
const authentication = require('./src/middlewares');
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const postsHandlers = post({ axios });
app.post('/', authentication, postsHandlers.post); // Solo haremos la parte de la creación

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
