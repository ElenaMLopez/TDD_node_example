const authentication = require('./authentication');

describe('Middlewares', () => {
  describe('Authentication middleware', () => {
    it('The user recived must have Id "1"', async () => {
      const req = {
        header: jest.fn().mockReturnValue('1'),
      };
      const res = {
        sendStatus: jest.fn(),
      };
      const next = jest.fn();

      await authentication(req, res, next);

      expect(req.header.mock.calls).toEqual([['user_id']]);
      expect(res.sendStatus.mock.calls).toEqual([]);
      expect(next.mock.calls).toEqual([[]]);
    });

    it('FAIL: User recibed don´t have user_id = 1 ', async () => {
      const req = {
        header: jest.fn().mockReturnValue('2'),
      };
      const res = {
        sendStatus: jest.fn(),
      };
      const next = jest.fn();

      await authentication(req, res, next);

      expect(req.header.mock.calls).toEqual([['user_id']]);
      expect(res.sendStatus.mock.calls).toEqual([[403]]);
      expect(next.mock.calls).toEqual([]);
    });
  });
});
