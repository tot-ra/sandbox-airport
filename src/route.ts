// @ts-ignore
import airports from "airport-data";

import { getAirport, filterAirports, Airport } from "./airports";
import { computeFlights, Flight } from "./flights";
import { getGeoDistance } from "./geo";

export function getShortestRoute(originAirport: Airport, destinationAirport: Airport): Flight[] {
  // narrow down search space to only airports that are within radiuses of both airports
  const reasonableAirports = filterAirports(
    originAirport,
    destinationAirport,
    airports
  );

  return search(
    originAirport,
    destinationAirport,
    reasonableAirports
  );
}

function search(source: Airport, target: Airport, airports: Airport[]): Flight[] {
  // breath search from both directions
  const sourceFlights = computeFlights(source, airports);
  const targetFlights = computeFlights(target, airports);
  let results: Flight[] = [];

  // minimization
  let minDistance = Infinity;

  for (const flight1 of sourceFlights) {
    // skip direct A->B flights
    if (flight1.to === target.icao) {
      continue;
    }

    // 1-hop flight, should be transitive so source -> target is the same as target -> source
    const distance =
      flight1.distance + getGeoDistance(getAirport(flight1.to), target);

    if (distance < minDistance) {
      minDistance = distance;
      results = [
        flight1,
        {
          from: flight1.to,
          to: target.icao,
          distance,
        },
      ];
    }

    for (const flight2 of targetFlights) {
      if (flight1.to === flight2.to) {
        continue;
      }

      // 2-hop flight
      const thirdFlightDistance = getGeoDistance(
        getAirport(flight1.to),
        getAirport(flight2.to)
      );
      const distance =
        flight1.distance + flight2.distance + thirdFlightDistance;
      if (distance < minDistance) {
        minDistance = distance;
        results = [
          flight1,
          {
            from: flight1.to,
            to: flight2.to,
            distance: thirdFlightDistance,
          },
          flight2,
        ];
      }
    }
  }

  return results;
}
