// @ts-ignore
import airports from "airport-data";
import { getGeoDistance } from "./geo";

export type Airport = {
    icao: string;
    latitude: number;
    longitude: number;
  };

export function filterAirports(
  origin: Airport,
  destination: Airport,
  airports: Airport[]
): Airport[] {
  // Compute the distance between the origin and destination airports.
  const originDestinationDistance = getGeoDistance(origin, destination);

  // Filter out the airports that are farther away than the origin-destination distance.
  return airports.filter((airport) => {
    return (
      getGeoDistance(origin, airport) <= originDestinationDistance &&
      getGeoDistance(destination, airport) <= originDestinationDistance
    );
  });
}

export function getAirport(code: string) {
  return airports.find((a: Airport) => a.icao === code);
}
