import fastify, { FastifyRequest } from 'fastify'
import { getAirport } from './airports';
import AirportGraph from './route';

const graph = new AirportGraph();
graph.initialize();

const server = fastify({logger: true})

server.get("/route", async (request: any, reply: any) => {
  // source
  const from = request.query["from"] as string;
  const originAirport = getAirport(from);

  if(!originAirport){
    return reply.status(400).send({ ok: false, error: "Invalid IATA code for source airport (from)" })
  }

  // destination
  const to = request.query["to"] as string;
  const destinationAirport = getAirport(to);

  if(!destinationAirport){
    return reply.status(400).send({ ok: false, error: "Invalid IATA code for target airport (to)" })
  }

  //default 100 ms, min 10ms, max 10 sec, 
  const timeout = request.query["timeout"] as string;
  let timeoutMs = timeout ? Math.min(parseInt(timeout, 10), 10000) : 100;
  timeoutMs = Math.max(timeoutMs, 10);


  console.log({timeoutMs});
  const route = graph.search(originAirport, destinationAirport, timeoutMs);

  return {
    route,
    url: `https://www.skyscanner.net/transport/flights/${from}/${to}`
  };
});

server.listen({
  host: '0.0.0.0',
  port: 8080
}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Started server at ${address}`)
})