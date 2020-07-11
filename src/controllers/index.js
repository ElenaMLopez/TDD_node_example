'use strict';

const handlers = ({ axios }) => ({
  // se colocan paréntesis al rededor de lo que sería un return en línea
  // porque necesitamos que devuelva un objeto y si no se ponen reconoce las llaves como las de una función
  get: async (req, res) => {
    const { data } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    res.send(data);
  },
  post: async (req, res) => {
    const { body } = req;
    const { data } = await axios.post(
      'https://jsonplaceholder.typicode.com/users',
      body
    );
    res.status(201).send(data);
  },
  put: async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, body);
    res.sendStatus(204);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
    res.sendStatus(204);
  },
});

module.exports = handlers;
