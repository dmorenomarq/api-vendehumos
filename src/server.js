const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
