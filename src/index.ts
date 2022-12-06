import fastify, { FastifyRequest } from 'fastify'
import { getShortestRoute } from './getShortestRoute';

const server = fastify({logger: true})

server.get("/route", async (request: any) => {
  const from = request.query["from"] as string;
  const to = request.query["to"] as string;

  const route = getShortestRoute(from, to);

  return {
    route
  };
});

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Started server at ${address}`)
})