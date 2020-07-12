// postHandlers
const posts = ({ axios }) => ({
  post: async (req, res) => {
    const { data: users } = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );

    // console.log(users.find(x => console.log(x.id)));
    // console.log('REQUEST BODY', req.body.userId);

    const found = users.find(x => x.id === req.body.userId);

    if (found) {
      const { data } = await axios.post(
        'https://jsonplaceholder.typicode.com/posts',
        req.body
      );

      return res.status(201).send(data);
    }

    return res.sendStatus(404);
  },
});

module.exports = {
  posts,
};