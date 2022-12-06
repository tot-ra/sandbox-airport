// @ts-ignore
import airports from "airport-data";

import { getGeoDistance } from "./geo";
import { Airport } from "./airports";

export type Flight = {
  from: string;
  to: string;
  distance: number;
};

const distances: Map<string, Map<string, number>> = new Map();

// precompute all distances in-memory
export function precomputeDistances() {
  console.log('precomputing distances');
  for (const src of airports) {
    const srcDistanceMap = new Map();

    for (const dst of airports) {
      if (src.icao === dst.icao) {
        continue;
      }

      srcDistanceMap.set(dst.icao, getGeoDistance(src, dst));
    }

    distances.set(src.icao, srcDistanceMap);
  }
  console.log('precomputing complete');
}

export function computeFlights(source: Airport, airports: Airport[]): Flight[] {
  const flights: Flight[] = [];
  for (const airport of airports) {
    if (source.icao !== airport.icao) {
      flights.push({
        from: source.icao,
        to: airport.icao,
        // @ts-ignore
        distance: distances.get(source.icao).get(airport.icao),
      });
    }
  }
  return flights;
}
