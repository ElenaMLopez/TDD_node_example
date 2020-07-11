# TDD

---

---

## Análisis de requisitos

Montaremos una API para un Blog usando TDD con las siguientes características:

1. Sólo para administradores (solo un administrador puede crear artículos).
2. Puede crear entradas a nombre de otro usuario.
3. Si el usuario no existiese, ha de lanzar un error.
4. El usuario ha de venir en el _body_ de la petición.

Partiendo del ejercicio anterior, hay que cambiar la entidad de usuarios por la de _posts_:

`./server.js`

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

`./src/index.js`

```js
const posts = require('./endopoints');

module.exports = {
  posts,
};
```

## Primer test

**Primer requerimiento**:

> 1. Sólo para administradores (solo un administrador puede crear artículos).

Teniendo en cuenta que el TDD se fundamenta en la realización de los test que se han de pasar ANTES del desarrollo del código mismo, lo primero es pensar que es necesario para gestionar los requirimientos solicitados. En este caso y puesto que _solo un Admin (que acordamos es el usuario que tendrá 'id = 1') puede crear una entrada_ lo primero que necesitaríamos sería un Middleware que realice esa comprobación y permita crear una entrada o no, según el id de un usuario. Este middleware será utilizado en el momento de hacer una petición _post_ en el `server.js`. Y creamos tanto la carpeta como el archivo del middleware que de momento está vacío. También creamos el archivo del test para el middleware.

Sabemos que los middlewares van a recibir 3 parámetros en express, _req, res, next_ así pués, lo primero será mockear estos parámetros. Con la función _netx()_ lo que hacemos es determinar que se ejecute la siguiente función o middleware que haya. Por eso en este caso, si no es es Admin, pues no se ejecuta la llamada al _axios.post_.
