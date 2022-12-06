import { getAirport, filterAirports, Airport } from "./airports";

describe("getAirport", () => {
  it("finds airport", () => {
    const result = getAirport("EETN");
    expect(result.name).toEqual("Lennart Meri Tallinn Airport");
  });
});

describe("filterAirports", () => {
  it("filters out airport that is too far away", () => {
    const from = { latitude: 1, longitude: 1 } as Airport;
    const to = { latitude: 1, longitude: 3 } as Airport;
    const airports = [
      { latitude: 1, longitude: 2 } as Airport,
      { latitude: 100, longitude: 100 } as Airport, //should be filtered out
    ];

    const result = filterAirports(from, to, airports);
    expect(result).toEqual([{ latitude: 1, longitude: 2 }]);
  });
});
