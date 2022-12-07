import { getAirport } from "./airports";
import { getGeoDistance } from "./geo";

describe("getGeoDistance", () => {
  it("calculates correct distance between Tallinn and Stokholm", () => {
    const km = Math.floor(getGeoDistance(getAirport("TLL"), getAirport("ARN")));
    expect(km).toEqual(391);
  });
});
