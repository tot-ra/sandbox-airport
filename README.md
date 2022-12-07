# airport-sandbox
An airport / flight route search service. Uses public [airport](https://www.npmjs.com/package/airports-data/v/1.2.0) and [route](https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat) data as nodes and edges.
Uses two-way graph breadth-first algorithm without recursion.

## Usage
```sh
nvm use
npm i
docker compose up
open http://localhost:8080/route?from=TLL&to=JFK
```

## Development
```sh
npm run dev
```

## Testing
```sh
npm run test:coverage
```

## API
### 🟢 GET /route

Params:

|param|description|
|---|---|
|`from`|IATA code for source airport|
|`to`|IATA code of target airport|
|`timeout`| (optional, integer, milliseconds) - max execution time. Min - 10ms, Default - 100ms, max - 10 sec. The higher timeout, the better is the precision.|

Example:
http://localhost:8080/route?from=TLL&to=JFK&timeout=10
![Screenshot_20221207_124028](https://user-images.githubusercontent.com/445122/206157719-fa7e8b65-f68b-45fc-8dbb-72823caf5247.png)


## Requirements
The task is to build a JSON over HTTP API endpoint that takes as input two IATA/ICAO airport codes and provides as output a route between these two airports so that:

The route consists of at most 4 legs/flights (that is, 3 stops/layovers, if going from A->B, a valid route could be A->1->2->3->B, or for example A->1->B etc.) and;

The route is the shortest such route as measured in kilometers of geographical distance.

Notes:

The weekdays and flight times are not important for the purposes of the test task - you are free to assume that all flights can depart at any required time

### Bonus (not implemented)
For the bonus part, extend your service so that it also allows changing airports during stops that are within 100km of each other. For example, if going from A->B, a valid route could be A->1->2=>3->4->B, where “2=>3” is a change of airports done via ground. These switches are not considered as part of the legs/layover/hop count, but their distance should be reflected in the final distance calculated for the route.

