const express = require('express');

const app = express();
const port = 3001;

let count = 0;


app.get('*', (req, res) => {
  process.stdout.write(`connection: ${server.connections}, count: ${++count}\n`);
  
  res.send('Hello, world!');
});

const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}`));