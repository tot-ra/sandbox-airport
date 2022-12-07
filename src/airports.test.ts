import { getAirport } from "./airports";

describe("getAirport", () => {
  it("finds airport", () => {
    const result = getAirport("TLL");
    expect(result.name).toEqual("Lennart Meri Tallinn Airport");
  });
});