import { getAirport } from "./airports";
import { getShortestRoute } from "./route";

describe("getShortestRoute", () => {
  it("calculates shortest route from TLL -> JFK", () => {
    const route = getShortestRoute(getAirport("TLL"), getAirport("JFK"));

    expect(route?.path).toEqual(["TLL", "TRD", "KEF", "JFK"])
    expect(route?.distance).toEqual(6659);
  });
});
