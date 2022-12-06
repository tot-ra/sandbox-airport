import { getGeoDistance } from "./geo";
import { Airport } from "./airports";


export type Flight = {
  from: string;
  to: string;
  distance: number;
};

export function computeFlights(source: Airport, airports: Airport[]): Flight[] {
  // This function computes the list of possible flights from the source airport
  // to all the other airports in the list.
  const flights: Flight[] = [];
  for (const airport of airports) {
    if (source.icao !== airport.icao) {
      const distance = getGeoDistance(source, airport);
      flights.push({ from: source.icao, to: airport.icao, distance });
    }
  }
  return flights;
}
