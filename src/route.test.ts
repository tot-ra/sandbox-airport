import { getAirport } from "./airports";
import { getShortestRoute } from "./route";

describe("getShortestRoute", () => {
  it("calculates shortest route from Tallinn -> Stokholm", () => {
    const route = getShortestRoute(getAirport("EETN"), getAirport("ESSA"));

    expect(route).toEqual([
      {
        distance: 5.972775464002833,
        from: "EETN",
        to: "EECL",
      },
      {
        distance: 391.60645520973407,
        from: "EECL",
        to: "ESSA",
      },
    ]);
  });

  it("calculates shortest route from Tallinn -> Minsk", () => {
    const route = getShortestRoute(getAirport("EETN"), getAirport("UMMS"));

    expect(route).toEqual([
      {
        distance: 400.735768640811,
        from: "EETN",
        to: "EVDA",
      },
      {
        distance: 646.0843451562106,
        from: "EVDA",
        to: "UMMS",
      },
    ]);
  });
});
