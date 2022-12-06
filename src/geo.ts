import { Airport } from "./airports";

// https://en.wikipedia.org/wiki/Haversine_formula
export function getGeoDistance(a: Airport, b: Airport) {
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
