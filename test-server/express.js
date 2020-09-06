const express = require('express');
const http = require('http');

const app = express();
const port = 3000;

let count = 0;


app.get('*', (req, res) => {
  // console.log('Connections: ', server.connections);
  console.log('Requests: ', ++count);
  
  res.send('Hello, world!');
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));