// postHandlers
module.exports = ({ axios }) => ({
  post: async (req, res) => {
    await axios.get('https://jsonplaceholder.typicode.com/users');
    const { data } = await axios.post(
      'https://jsonplaceholder.typicode.com/posts',
      req.body
    );
    res.status(201).send(data);
  },
});
