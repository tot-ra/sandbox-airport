import fastify, { FastifyRequest } from 'fastify'
import { getAirport } from './airports';
import { getShortestRoute } from './route';

const server = fastify({logger: true})

server.get("/route", async (request: any, reply: any) => {
  const from = request.query["from"] as string;
  const to = request.query["to"] as string;

  const originAirport = getAirport(from);

  if(!originAirport){
    return reply.status(400).send({ ok: false, error: "Invalid IATA code for source airport (from)" })
  }

  const destinationAirport = getAirport(to);

  if(!destinationAirport){
    return reply.status(400).send({ ok: false, error: "Invalid IATA code for target airport (to)" })
  }
  
  const route = getShortestRoute(originAirport, destinationAirport);

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