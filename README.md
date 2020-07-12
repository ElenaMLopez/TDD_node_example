# TDD

---

## Análisis de requisitos

Montaremos una API para un Blog usando TDD con las siguientes características:

1. Sólo para administradores (solo un administrador puede crear artículos).
2. Puede crear entradas a nombre de otro usuario.
3. Si el usuario no existiese, ha de lanzar un error.
4. El usuario ha de venir en el _body_ de la petición.

- Partiendo del ejercicio anterior, hay que cambiar la entidad de usuarios por la de _posts_.
- Creamos también el archivo para el middleware y lo importamos en `server.js`, aunque de momento esté vacío

`./server.js`

```js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { posts } = require('./src/endpoints');
const { authentication } = require('./src/middlewares');
console.log(typeof authentication);

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const postsHandlers = posts({ axios });

app.post('/', authentication, postsHandlers.post); // Solo haremos la parte de la creación

app.listen(port, function () {
  console.log(`App listening on port ${port}!`);
});
```

`./src/index.js`

```js
const posts = require('./endpoints');

module.exports = {
  posts,
};
```

## Primer test: El usuario tiene id = '1' (es Administrador)

**Primer requerimiento**:

> 1. Sólo para administradores (solo un administrador puede crear artículos).

Teniendo en cuenta que el TDD se fundamenta en la realización de los test que se han de pasar ANTES del desarrollo del código mismo, lo primero es pensar que es necesario para gestionar los requirimientos solicitados. En este caso y puesto que _solo un Admin (que acordamos es el usuario que tendrá 'id = 1') puede crear una entrada_ lo primero que necesitaríamos sería un Middleware que realice esa comprobación y permita crear una entrada o no, según el id de un usuario. Este middleware será utilizado en el momento de hacer una petición _post_ en el `server.js`. Y creamos tanto la carpeta como el archivo del middleware que de momento está vacío. También creamos el archivo del test para el middleware.

Sabemos que los middlewares van a recibir 3 parámetros en express, _req, res, next_ así pués, lo primero será mockear estos parámetros. Con la función _netx()_ lo que hacemos es determinar que se ejecute la siguiente función o middleware que haya. Por eso en este caso, si no es es Admin, pues no se ejecuta la llamada al _axios.post_:

```js
const authentication = require('./authentication');

describe('Middlewares', () => {
  describe('Authentication middleware', () => {
    it('The user recived must have Id "1"', async () => {
      const req = {
        header: jest.fn().mockReturnValue('1'),
      };
      const res = {
        sendStatus: jest.fn(),
      }; // se usa sólo si hay error pero esto se hace en otro test. Ahora se conprueba sólo que no se llama.
      const next = jest.fn();

      await authentication(req, res, next);
      expect(req.header.mock.calls).toEqual([
        ['user_id'], // al no tener un array vacío se confirma que se llama una vez y tiene user_id en la cabecera.
      ]);
      expect(res.sendStatus.mock.calls).toEqual([]);
      expect(next.mock.calls).toEqual([[]]); // El array con un array vacío es que se llama next() sin parámetros
    });
    // Gestión del error en caso de que el usuario que me llega en req no tiene user_id = 1
    it('FAIL: User recibed don´t have user_id = 1 ', async () => {
      const req = {
        header: jest.fn().mockReturnValue('2'),
      };
      const res = {
        sendStatus: jest.fn(),
      }; // se usa sólo si hay error pero esto se hace en otro test. Ahora se conprueba sólo que no se llama.
      const next = jest.fn();

      await authentication(req, res, next);

      expect(req.header.mock.calls).toEqual([['user_id']]);
      expect(res.sendStatus.mock.calls).toEqual([[403]]);
      expect(next.mock.calls).toEqual([]); // El array vacío, es que no se llama (no autorizado no hace el post)
    });
  });
});
```

Según esto, al lanzar los test con Jest, van aa fallar todos, y lo que se hace es ir fallo a fallo resolviéndolo. para ello se ha de generar el contenido del archivo `./src/middlewares/aunthentication.js`:

```js
/* Recibiendo los tres parametros de un middleware el módulo exporta la comprobación de si el usuario tiene id = '1', y de no tenerla retorna una respuesta de status: 403 forbiden. En caso contrario se llama a next(), y en este caso se realizará la petición post */

module.exports = (req, res, next) => {
  const userId = req.header('user_id');
  if (userId !== '1') {
    return res.sendStatus(403);
  }
  next();
};
```

---

## Segundo test: Crear un post a nombre de otro usuario y lanzar error si el usuario no existe (la información viene el el body)

Los siguientes requerimientos son

> 2. Puede crear entradas a nombre de otro usuario.
> 3. Si el usuario no existiese, ha de lanzar un error.
> 4. El usuario ha de venir en el _body_ de la petición.

Visitando la web de [jsonplaceholder](https://jsonplaceholder.typicode.com/), vemos que al traer los _posts_ o entradas, nos devuelve esto:

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  }
  //muchas más con la misma estructura
]
```

De esta forma ya sabemos que lo que ha de enviarse tiene los siguientes campos `userId, id, title, body`. En nuestro caso el `userId` será lo utilizado para saber si el usuario no existe, y por tanto lanzar el error. Toda la info ha de viajar en el `req.body` de la petición post.

```js
/**
 * Para enviar: 
 *   {
    "userId": 1,
    "id": 1,
    "title": "Título",
    "body": "Cuerpo del post"
  },
 */
describe('Endpoints', () => {
  describe('post', () => {
    it.skip('Make a post', () => {
      const mockUsers = [{ id: '1' }, { id: '2' }];
      const mockPost = {
        userId: 1,
        id: 1,
        title: 'Título',
        body: 'Cuerpo del post',
      };
      const req = {
        body: mockPost,
      };
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      const axios = {
        get: jest.fn().mockResolveValue({ data: mockUsers }),
        post: jest.fn(),
      };
    });
  });
});
```

Importamos el `postHandlers`, y realizamos las pruebas para confirmar el status de la llamada que ha de ser 201 (creado), para confirmar que el post se hace a la url de los post de json placeholder, y tambien que se realiza el get a la url. Por último se ha de realizar la prueba de que efectivamente se envía en la _data_ el id

```js
const postHandlers = require('./index');

describe('Endpoints', () => {
  describe('post', () => {
    it.skip('Make a post', async () => {
      const mockUsers = [{ id: '1' }, { id: '2' }];
      const mockPost = {
        userId: 1,
        title: 'Título',
        body: 'Cuerpo del post',
      };
      const req = {
        body: mockPost,
      };
      const res = {
        status: jest.fn(),
        send: jest.fn(),
      };
      const axios = {
        get: jest.fn().mockResolvedValue({ data: mockUsers }),
        post: jest.fn().mockResolvedValue({ data: { id: 1000 } }),
      };
      await postHandlers({ axios }).post(req, res);
      expect(res.status.mock.calls).toEqual([[201]]);
      expect(res.send.mock.calls).toEqual([[{ id: 1000 }]]);
      expect(axios.get.mock.calls).toEqual([
        ['https://jsonplaceholder.typicode.com/users'],
      ]);
      // axios.post nos ha de devolver el id de la entrada creada
      expect(axios.post.mock.calls).toEqual([
        ['https://jsonplaceholder.typicode.com/posts', mockPost],
      ]);
    });
  });
});
```

A partir de esto, ya podemos construir el postHandler:

`./endpoints/index.js`

```js
// postHandlers
module.exports = ({ axios }) => ({
  post: async (req, res) => {
    await axios.get('https://jsonplaceholder.typicode.com/users');
    await axios.post('https://jsonplaceholder.typicode.com/posts', req.body);
    res.status(201).send({ id: 1000 });
  },
});
```

Pero esto de momento es válido, porque estamos pasando un id que coincide con el que hay en el test, y esto no puede ser, puesto que si el id del test cambia, fallarán. Para solucionarlo, creamos la constante `{ data }` y esto será nuestro post en realidad:

`/endpoints/index.js`

```js
module.exports = ({ axios }) => ({
  post: async (req, res) => {
    await axios.get('https://jsonplaceholder.typicode.com/users');
    const { data } = await axios.post(
      // Se crea { data }
      'https://jsonplaceholder.typicode.com/posts',
      req.body
    );
    res.status(201).send(data); // Se envía data
  },
});
```

### Manejando el caso de error: El id de usuario no existe.

Vamos a manejar la situación de que el Admin crea una entrada al blog y se la asigna a un usuario, y el id del usuario no existe.

Comenzamos con el test, en el archivo `/endpoints/index.spec.js`, donde debajo del test de _Make a post_ pondemos el siguiente:

```js
it('Should throw an error if the user to whom you want to assign a post don´t exist', async () => {});
```

Empezamos realizando los mocks del test:

```js
it('Should throw an error if the user to whom you want to assign a post don´t exist', async () => {
  const mockUsers = [{ id: '1' }, { id: '2' }];
  const mockPost = {
    userId: '3', // Colocamos un id que no existe en nuestro mock para que de error
    title: 'Título',
    body: 'Cuerpo del post',
  };
  const req = {
    body: mockPost,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    sendStatus: jest.fn(),
  };
  const axios = {
    get: jest.fn().mockResolvedValue({ data: mockUsers }),
    post: jest.fn().mockResolvedValue({ data: { id: 1000 } }),
  };

  await postHandlers({ axios }).post(req, res); // Llamamos al handler
});
```

En este caso lo que queremos es confirmar que tenemos una respuesta de error (puede ser 500 o en este caso uso 400 porque el usuario no se encuentra en nuestro JSON recibido y sería un *Bad Request*), y además confirmar que el middleware NO ejecuta el _axios.post_ tras este error:

```js
it('Should throw an error if the user to whom you want to assign a post don´t exist', async () => {
  const mockUsers = [{ id: '1' }, { id: '2' }];
  const mockPost = {
    userId: '3',
    title: 'Título',
    body: 'Cuerpo del post',
  };
  const req = {
    body: mockPost,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    sendStatus: jest.fn(),
  };
  const axios = {
    get: jest.fn().mockResolvedValue({ data: mockUsers }),
    post: jest.fn().mockResolvedValue({ data: { id: 1000 } }),
  };

  await postHandlers({ axios }).post(req, res);

  expect(axios.post.mock.calls).toEqual([]); // Array vacío, no se llama a post
  expect(res.sendStatus.mock.calls).toEqual([[400]]); // Envío de error 400 al cliente
});
```

Una vez hecho el test le llega el turno al postHandler:

`/endopoints/index.js`

```js
module.exports = ({ axios }) => ({
  post: async (req, res) => {
    await axios.get('https://jsonplaceholder.typicode.com/users');
    const { data } = await axios.post(
      // Se crea { data }
      'https://jsonplaceholder.typicode.com/posts',
      req.body
    );
    res.status(201).send(data); // Se envía data
  },
});
// De momento tan solo se hace un post pero no hay gestión del error de que el id de usuario no exista
```

Lo que debemos hacer es buscar en la _data_ que nos devuelve el _get_ a la url de usuarios de Jsonplaceholder y en caso de que no exista devolver un error. Esto lo podemos hacer con un find(). Para que sea más descriptivo, pasamos de _data_ a _users_ y almacenamos con un await lo que nos traiga el axios.get.

Tras eso, podemos declarar una constante, que almacena un .find() de users, de forma que si tenemos un .id que coincide con _req.body.userId_ (que es lo que tenemos en el body del request como id de usuario) esta constante existe y tiene el valor del id, sin ser null, false o undefined. Y ya sobre esta gestionamos el caso de que sí exista el usuario y metemos el _axios.post_ y el _body_.

Si esto nos devuelve un undefined (porque el usuario no existe), saltará directamente al envío de un status *400 Bad request* :

`/endopoints/index.js`

```js
const posts = ({ axios }) => ({
  post: async (req, res) => {
    const { data: users } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );

    const found = users.find(x => x.id === req.body.userId);

    if (found) {
      const { data } = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        req.body
      );

      return res.status(201).send(data);
    }

    return res.sendStatus(400);
  },
});

module.exports = {
  posts,
};
```
