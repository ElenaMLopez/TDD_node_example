const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { users } = require('./src');
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // Parsea lo que venga en el body

app.use(bodyParser.json()); // Parsea lo que enviamos nostotros

// CRUD
const usersHandlers = users({ axios });
app.get('/', usersHandlers.get);
app.post('/', usersHandlers.post);
app.put('/:id', usersHandlers.put);
app.delete('/:id', usersHandlers.delete);

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
