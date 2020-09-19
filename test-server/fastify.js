const fastify = require('fastify')();


let count = 0;

fastify.get('*', async (request, reply) => {
  process.stdout.write(`connection: ${fastify.server.connections}, count: ${++count}\n`);

  return 'Hello, world!';
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3002)
    console.log(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
start()