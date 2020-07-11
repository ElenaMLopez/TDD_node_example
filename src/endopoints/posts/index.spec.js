const postHandlers = require('./index');

describe('Endpoints', () => {
  describe('post', () => {
    it('Make a post', async () => {
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
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const axios = {
        get: jest.fn().mockResolvedValue({ data: mockUsers }),
        post: jest.fn().mockResolvedValue({ data: { id: 1000 } }),
      };
      await postHandlers({ axios }).post(req, res);
      expect(res.status.mock.calls).toEqual([[201]]);
      // axios.post nos ha de devolver el id de la entrada creada
      expect(res.send.mock.calls).toEqual([[{ id: 1000 }]]);
      expect(axios.get.mock.calls).toEqual([
        ['https://jsonplaceholder.typicode.com/users'],
      ]);
      expect(axios.post.mock.calls).toEqual([
        ['https://jsonplaceholder.typicode.com/posts', mockPost],
      ]);
    });
  });
});
