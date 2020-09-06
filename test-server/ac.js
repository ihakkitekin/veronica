const autocannon = require('autocannon');

autocannon({
  url: 'http://localhost:3000',
  connections: 1,
  pipelining: 1,
  duration: 5
}, console.log);