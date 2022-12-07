"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const airports_1 = require("./airports");
const geo_1 = require("./geo");
const routes_1 = __importDefault(require("./routes"));
class AirportGraph {
    constructor() {
        // Create an object to store a mapping of airport names to sets of neighboring airports
        this.airports = {};
    }
    // Define a method to add an airport to the graph
    addAirport(airport) {
        // If the airport does not yet exist in the graph, add it
        if (!this.airports[airport]) {
            this.airports[airport] = new Map();
        }
    }
    initialize() {
        console.log("Loading routes into memory...");
        for (const [srcIATA, dstIATA] of routes_1.default) {
            if (srcIATA === dstIATA) {
                continue;
            }
            const src = (0, airports_1.getAirport)(srcIATA);
            const dst = (0, airports_1.getAirport)(dstIATA);
            if (!src || !dst) {
                continue;
            }
            this.addRoute(srcIATA, dstIATA, (0, geo_1.getGeoDistance)(src, dst));
        }
    }
    // Define a method to add a route between two airports with a given distance
    addRoute(source, destination, distance) {
        // Add the source and destination airports to the graph if they do not yet exist
        this.addAirport(source);
        this.addAirport(destination);
        // Add the destination airport to the set of neighbors for the source airport with the given distance
        this.airports[source].set(destination, distance);
    }
    search(source, destination, maxTimeSec = 100) {
        // Create a map to store the distances from the source to each airport
        const distances = new Map();
        // Initialize the distances from the source to itself and to the destination
        distances.set(source, 0);
        // what to go through
        const srcQueue = [
            {
                last: source.iata,
                path: [source.iata],
                distance: 0,
            },
        ];
        const dstQueue = [
            {
                last: destination.iata,
                path: [destination.iata],
                distance: 0,
            },
        ];
        const startTimeStamp = Date.now();
        const results = [];
        let srcVisited = [];
        let dstVisited = [];
        let srcMinPathTo = new Map();
        let dstMinPathTo = new Map();
        while (srcQueue.length > 0 && Date.now() < startTimeStamp + maxTimeSec) {
            // Get the current airport from each queue
            const srcItem = srcQueue.shift();
            const dstItem = dstQueue.shift();
            let lastBestResultDistance = Infinity;
            // all graph covered
            if (!srcItem || !dstItem) {
                break;
            }
            /*
            console.debug("Iterating through graph, queue size:", {
              srcQueue: srcQueue.length,
              dstQueue: dstQueue.length,
              srcItem,
              dstItem,
            });
            */
            // makes no sense to continue paths if better result was already found
            if (srcItem.distance <= lastBestResultDistance) {
                // Visit the current airport from the source search
                for (const [target, distance] of this.airports[srcItem.last]) {
                    const totalDistance = srcItem.distance + distance;
                    const route = {
                        last: target,
                        path: [...srcItem.path, target],
                        distance: totalDistance,
                    };
                    // src reached destination
                    if (target === destination.iata) {
                        results.push(route);
                        break;
                    }
                    // no more than 5 items in path based on requirements
                    if (route.path.length > 5) {
                        break;
                    }
                    // avoid loops
                    if (srcItem.path.includes(target)) {
                        continue;
                    }
                    // makes no sense to continue paths if better result was already found
                    if (totalDistance > lastBestResultDistance) {
                        continue;
                    }
                    // save visited areas in case we intersect with other search
                    if (!srcVisited.includes(target)) {
                        srcVisited.push(target);
                    }
                    // save most optimal reached areas
                    const exMinPath = srcMinPathTo.get(target);
                    if (exMinPath) {
                        if (exMinPath.distance > totalDistance) {
                            srcMinPathTo.set(target, route);
                        }
                        else {
                            // we already were in this node before with more optimal path
                            // makes no sense to continue this search path
                            break;
                        }
                    }
                    // two-way search connected
                    if (dstVisited.includes(target) && dstMinPathTo.get(target)) {
                        const resultDistance = 
                        // @ts-ignore
                        totalDistance + dstMinPathTo.get(target).distance;
                        results.push({
                            path: [
                                ...srcItem.path,
                                target,
                                // @ts-ignore
                                dstMinPathTo.get(target).path.reverse(),
                            ],
                            distance: resultDistance,
                        });
                        if (resultDistance < lastBestResultDistance) {
                            lastBestResultDistance = resultDistance;
                        }
                        continue;
                    }
                    srcQueue.push(route);
                }
            }
            if (dstItem.distance <= lastBestResultDistance) {
                for (const [target, distance] of this.airports[dstItem.last]) {
                    const route = {
                        last: target,
                        path: [...dstItem.path, target],
                        distance: dstItem.distance + distance,
                    };
                    const totalDistance = dstItem.distance + distance;
                    // destination reached source
                    if (target === source.iata) {
                        results.push({
                            path: [...dstItem.path, target].reverse(),
                            distance: totalDistance,
                        });
                        break;
                    }
                    // no more than 5 items in path based on requirements
                    if (route.path.length > 5) {
                        break;
                    }
                    // avoid loops
                    if (dstItem.path.includes(target)) {
                        continue;
                    }
                    // makes no sense to continue paths if better result was already found
                    if (totalDistance > lastBestResultDistance) {
                        continue;
                    }
                    if (!dstVisited.includes(target)) {
                        dstVisited.push(target);
                    }
                    // save most optimal reached areas
                    const exMinPath = dstMinPathTo.get(target);
                    if (exMinPath) {
                        if (exMinPath.distance > totalDistance) {
                            dstMinPathTo.set(target, route);
                        }
                        else {
                            // we already were in this node before with more optimal path
                            // makes no sense to continue this search path
                            break;
                        }
                    }
                    // two-way search connected
                    if (srcVisited.includes(target) && srcMinPathTo.get(target)) {
                        const resultDistance = 
                        // @ts-ignore
                        totalDistance + srcMinPathTo.get(target).distance;
                        results.push({
                            path: [
                                ...dstItem.path,
                                target,
                                // @ts-ignore
                                srcMinPathTo.get(target).path.reverse(),
                            ].reverse(),
                            distance: resultDistance,
                        });
                        if (resultDistance < lastBestResultDistance) {
                            lastBestResultDistance = resultDistance;
                        }
                        continue;
                    }
                    dstQueue.push(route);
                }
            }
        }
        // find fastest among results
        let lowestDistance = Number.MAX_VALUE;
        let lowestDistanceObject = null;
        for (const result of results) {
            if (result.distance < lowestDistance) {
                lowestDistance = result.distance;
                lowestDistanceObject = result;
            }
        }
        if (lowestDistanceObject) {
            return {
                path: lowestDistanceObject.path,
                distance: lowestDistanceObject.distance,
                airports: lowestDistanceObject.path.map((iata) => (0, airports_1.getAirport)(iata)),
            };
        }
    }
}
exports.default = AirportGraph;
