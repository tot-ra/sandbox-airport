// @ts-ignore
import airports from "airport-data";

export type IATA = string;

export type Airport = {
    iata: IATA;
    latitude: number;
    longitude: number;
  };

export function getAirport(code: IATA) {
  return airports.find((a: Airport) => a.iata === code);
}
