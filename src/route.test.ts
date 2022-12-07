import { getAirport } from "./airports";
import AirportGraph from "./route";

describe("getShortestRoute", () => {
  const graph = new AirportGraph();
  graph.initialize();

  it("calculates shortest route within 10ms from TLL -> JFK", () => {
    const route = graph.search(getAirport("TLL"), getAirport("JFK"), 10);

    expect(route?.path).toEqual(["TLL", "ARN", "JFK"])
    expect(route?.distance).toEqual(6683);
  });

  it("calculates shortest route within 1 sec from TLL -> JFK", () => {
    const route = graph.search(getAirport("TLL"), getAirport("JFK"), 1000);

    expect(route?.path).toEqual(["TLL", "TRD", "KEF", "JFK"])
    expect(route?.distance).toEqual(6659);
  });
});
