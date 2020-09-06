const fastify = require('fastify')();


let count = 0;

fastify.get('*', async (request, reply) => {
  console.log('Request: ', ++count);

  return 'Hello, world!';
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    console.log(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
start()