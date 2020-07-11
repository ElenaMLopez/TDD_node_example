# TDD

---

---

## Análisis de requisitos

Montaremos una API para un Blog usando TDD con las siguientes características:

- Sólo para administradores (solo un administrador puede crear artículos).
- Puede crear entradas a nombre de otro usuario.
- Si el usuario no existiese, ha de lanzar un error.
- El usuario ha de venir en el _body_ de la petición.

Partiendo del ejercicio anterior, hay que cambiar la entidad de usuarios por la de _posts_:

`server.js`

```js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { post } = require('./src');
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const postHandlers = post({ axios });
app.post('/', postHandlers.post); // Solo haremos la parte de la creación

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
```
