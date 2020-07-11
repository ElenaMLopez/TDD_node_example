const authentication = require('./authentication')
describe('Middlewares', () => {
  describe('Authentication middleware', () => {
    it('The user recived must have Id "1"', async () => {
      const req = {
        header = jest.fn().mockReturnValue('1')
      }
      const res = {
        sendStatus: jest.fn()
      } // se usa sólo si hay error pero esto se hace en otro test. Ahora se conprueba sólo que no se llama.
      const next = jest.fn()
      
      await authentication(req, res, next) 
      expect(req.header.mock.calls).toEqual([
        ['user_id'] // al no tener un array vacío se confirma que se llama una vez y tiene user_id en la cabecera.
      ])
      expect(res.sendStatus.mock.calls).toEqual([])
      expect(next.mock.calls).toEqual([[]])
    });
  });
});
