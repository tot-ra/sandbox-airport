"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAirport = void 0;
// @ts-ignore
const airport_data_1 = __importDefault(require("airport-data"));
function getAirport(code) {
    return airport_data_1.default.find((a) => a.iata === code);
}
exports.getAirport = getAirport;
