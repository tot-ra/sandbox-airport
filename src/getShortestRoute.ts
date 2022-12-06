// @ts-ignore
import airports from "airport-data";

type Airport = {
  icao: string;
  latitude: number;
  longitude: number;
};

type Flight = {
  from: string;
  to: string;
  distance: number;
};

export function getShortestRoute(origin: string, destination: string): any {
  const originAirport = airports.find(
    (airport: Airport) => airport.icao === origin
  );
  const destinationAirport = airports.find(
    (airport: Airport) =>
      airport.icao === destination
  );

  // narrow down search space to only airports that are within radiuses of both airports
  const reasonableAirports = filterAirports(
    originAirport,
    destinationAirport,
    airports
  );

  const intermediateAirports = search(
    originAirport,
    destinationAirport,
    reasonableAirports
  );

  return intermediateAirports;
}

// https://en.wikipedia.org/wiki/Haversine_formula
function getDistance(a: Airport, b: Airport) {
  const lat1 = a.latitude;
  const lon1 = a.longitude;
  const lat2 = b.latitude;
  const lon2 = b.longitude;

  // Convert to radians
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  // Calculate great circle distance using the Haversine formula
  const dlon = lon2Rad - lon1Rad;
  const dlat = lat2Rad - lat1Rad;
  const a2 =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(dlon / 2), 2);
  const c = 2 * Math.atan2(Math.sqrt(a2), Math.sqrt(1 - a2));
  const distance = 6371 * c; // 6371 is the radius of the Earth in kilometers

  return distance;
}

const computeFlights = (source: Airport, airports: Airport[]): Flight[] => {
  // This function computes the list of possible flights from the source airport
  // to all the other airports in the list.
  const flights: Flight[] = [];
  for (const airport of airports) {
    if (source.icao !== airport.icao) {
      const distance = getDistance(source, airport);
      flights.push({ from: source.icao, to: airport.icao, distance });
    }
  }
  return flights;
};

function filterAirports(
  origin: Airport,
  destination: Airport,
  airports: Airport[]
): Airport[] {
  // Compute the distance between the origin and destination airports.
  const originDestinationDistance = getDistance(origin, destination);

  // Filter out the airports that are farther away than the origin-destination distance.
  return airports.filter((airport) => {
    return (
      getDistance(origin, airport) <= originDestinationDistance &&
      getDistance(destination, airport) <= originDestinationDistance
    );
  });
}

function getAirport(code: string) {
  return airports.find((a: Airport) => a.icao === code);
}

const search = (
  source: Airport,
  target: Airport,
  airports: Airport[]
): Flight[] => {

  // breath search from both directions
  const sourceFlights = computeFlights(source, airports);
  const targetFlights = computeFlights(target, airports);
  let results: Flight[] = [];

  // minimization
  let minDistance = Infinity;

  for (const flight1 of sourceFlights) {

    // skip direct A->B flights
    if(flight1.to === target.icao){
      continue;
    }

    // 1-hop flight, should be transitive so source -> target is the same as target -> source
    const distance = flight1.distance + getDistance(getAirport(flight1.to), target);

    if (distance < minDistance) {
      minDistance = distance;
      results = [flight1, {
        from: flight1.to,
        to: target.icao,
        distance,
      }];
    }

    for (const flight2 of targetFlights) {
      if(flight1.to === flight2.to){
        continue;
      }

      // 2-hop flight
      const thirdFlightDistance = getDistance(getAirport(flight1.to), getAirport(flight2.to))
      const distance = flight1.distance + flight2.distance + thirdFlightDistance;
      if (distance < minDistance) {
        minDistance = distance;
        results = [flight1, {
          from: flight1.to,
          to: flight2.to,
          distance: thirdFlightDistance,
        }, flight2];
      }
    }
  }

  return results;
};
