const handlers = require('./index');

describe('Endpoints', () => {
  describe('users', () => {
    describe('get', () => {
      it('return a user in a json', async () => {
        // mock de axios: jest.fn()
        const axios = {
          get: jest.fn().mockResolvedValue({ data: 1 }), // este mock
          /**devuelve un valor que luego se pasa a send en nuestro
           * get. El valor de { data } no es relevante en realidad aquí
           * Lo relevante es que reciba lo que reciba tiene que mandarlo
           */
        };
        // Mock para los métodos de status y send
        const res = {
          status: jest.fn().mockReturnThis(),
          send: jest.fn(),
        };
        await handlers({ axios }).get({}, res);
        // res.status.mock.calls retorna un array con los argumentos pasados en status, ok es [200]
        expect(axios.get.mock.calls).toEqual([
          ['https://jsonplaceholder.typicode.com/users'],
        ]);
        expect(res.send.mock.calls).toEqual([[1]]);
      });
    });
    // post put y delete
    describe('post', () => {
      describe('create a user', () => {
        it('post a user', async () => {
          const axios = {
            post: jest.fn().mockResolvedValue({ data: 1 }),
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
          };
          const req = {
            body: 'request body',
          };
          await handlers({ axios }).post(req, res);

          expect(res.status.mock.calls).toEqual([[201]]);
          expect(res.send.mock.calls).toEqual([[1]]);
          expect(axios.post.mock.calls).toEqual([
            ['https://jsonplaceholder.typicode.com/users', 'request body'],
          ]);
        });
      });
    });

    describe('put', () => {
      it('update resources', async () => {
        const axios = {
          put: jest.fn().mockResolvedValue({ data: 1 }),
        };
        const req = {
          body: 'request body',
          params: {
            id: 12,
          },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          sendStatus: jest.fn(),
        };
        await handlers({ axios }).put(req, res);
        expect(res.sendStatus.mock.calls).toEqual([[204]]);
        expect(axios.put.mock.calls).toEqual([
          ['https://jsonplaceholder.typicode.com/users/12', 'request body'],
        ]);
      });
    });
    describe('delete', () => {
      describe('delete a resource', () => {
        it('should delete a user', async () => {
          const axios = {
            delete: jest.fn().mockResolvedValue({ data: 1 }),
          };
          const req = {
            params: {
              id: 12,
            },
          };
          const res = {
            sendStatus: jest.fn(),
          };
          await handlers({ axios }).delete(req, res);
          expect(axios.delete.mock.calls).toEqual([
            ['https://jsonplaceholder.typicode.com/users/12'],
          ]);
          expect(res.sendStatus.mock.calls).toEqual([[204]]);
        });
      });
    });
  });
});
