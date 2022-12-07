"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeoDistance = void 0;
// https://en.wikipedia.org/wiki/Haversine_formula
function getGeoDistance(src, dst) {
    // Convert to radians
    const lat1 = (src.latitude * Math.PI) / 180;
    const lon1 = (src.longitude * Math.PI) / 180;
    const lat2 = (dst.latitude * Math.PI) / 180;
    const lon2 = (dst.longitude * Math.PI) / 180;
    const a = Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
        Math.cos(lat1) *
            Math.cos(lat2) *
            Math.pow(Math.sin((lon2 - lon1) / 2), 2);
    // 6371 is the radius of the Earth in kilometers
    // cast to integer to consume less memory
    return Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
exports.getGeoDistance = getGeoDistance;
