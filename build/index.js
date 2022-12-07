"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const airports_1 = require("./airports");
const route_1 = __importDefault(require("./route"));
const graph = new route_1.default();
graph.initialize();
const server = (0, fastify_1.default)({ logger: true });
server.get("/route", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    // source
    const from = request.query["from"];
    const originAirport = (0, airports_1.getAirport)(from);
    if (!originAirport) {
        return reply.status(400).send({ ok: false, error: "Invalid IATA code for source airport (from)" });
    }
    // destination
    const to = request.query["to"];
    const destinationAirport = (0, airports_1.getAirport)(to);
    if (!destinationAirport) {
        return reply.status(400).send({ ok: false, error: "Invalid IATA code for target airport (to)" });
    }
    //default 100 ms, min 10ms, max 10 sec, 
    const timeout = request.query["timeout"];
    let timeoutMs = timeout ? Math.min(parseInt(timeout, 10), 10000) : 100;
    timeoutMs = Math.max(timeoutMs, 10);
    console.log({ timeoutMs });
    const route = graph.search(originAirport, destinationAirport, timeoutMs);
    return {
        route,
        url: `https://www.skyscanner.net/transport/flights/${from}/${to}`
    };
}));
server.listen({
    host: '0.0.0.0',
    port: 8080
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Started server at ${address}`);
});
