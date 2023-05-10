"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const LocationData_1 = require("./LocationData");
const lodash_1 = __importDefault(require("lodash"));
const KafkaClient_1 = require("./KafkaClient");
let currentFictiveTimeStamp = Date.now();
function generateRandomDouble(lowerBound, upperBound) {
    return Math.random() * (upperBound - lowerBound) + lowerBound;
}
function generateRandomNumber(lowerBound, upperBound, step = 1) {
    const random = Math.floor(generateRandomDouble(lowerBound, upperBound));
    return random - random % step;
}
function generateSessionId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
function generateRandomMacAddress() {
    const hexChars = '0123456789ABCDEF';
    let macAddress = '';
    for (let i = 0; i < 6; i++) {
        let segment = '';
        for (let j = 0; j < 2; j++) {
            const randomIndex = Math.floor(Math.random() * hexChars.length);
            segment += hexChars[randomIndex];
        }
        macAddress += `${segment}${i < 5 ? ':' : ''}`;
    }
    return macAddress;
}
function generateRandomCoordinates(minLat, maxLat, minLon, maxLon) {
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lng = Math.random() * (maxLon - minLon) + minLon;
    return { lat, lng };
}
function getRandomDeviceBrand() {
    const smartphoneBrands = [
        "Apple",
        "Samsung",
        "Xiaomi",
        "Huawei",
        "Oppo",
        "OnePlus",
        "Motorola",
        "Sony",
        "LG",
        "Nokia"
    ];
    return smartphoneBrands[generateRandomNumber(0, smartphoneBrands.length)];
}
function generateRandomLocationData() {
    const data = new LocationData_1.LocationData();
    currentFictiveTimeStamp += generateRandomNumber(1, 1000);
    const coordinates = generateRandomCoordinates(0, 10, 0, 10);
    data.lat = coordinates.lat.toString();
    data.lng = coordinates.lng.toString();
    data.macAddress = generateRandomMacAddress().toString();
    data.sessionId = generateSessionId().toString();
    data.session_start_timestamp = currentFictiveTimeStamp.toString();
    data.timestamp = currentFictiveTimeStamp.toString();
    data.devicebrand = getRandomDeviceBrand();
    var number = generateRandomNumber(0, 160);
    // console.log(number);
    data.speed = `${number} km/h`;
    data.alert = number > 100 ? "true" : "false";
    return data;
}
function moveLocationData(locationsData) {
    const locationDataToMove = lodash_1.default.cloneDeep(locationsData);
    currentFictiveTimeStamp += generateRandomNumber(1, 1000);
    locationDataToMove.timestamp = currentFictiveTimeStamp.toString();
    locationDataToMove.lat = (+locationDataToMove.lat + generateRandomDouble(-0.001, 0.001)).toString();
    locationDataToMove.lng = (+locationDataToMove.lng + generateRandomDouble(-0.001, 0.001)).toString();
    const arr = locationDataToMove.speed.split(" ");
    var speed = generateRandomNumber(Math.max(0, +arr[0] - 40), Math.min(+arr[0] + 40, 160));
    locationDataToMove.alert = +arr[0] > 100 ? "true" : "false";
    locationDataToMove.speed = `${speed} km/h`;
    return locationDataToMove;
}
;
let data = generateRandomLocationData();
const numberOfSession = 10; // how many vehicule will connect to the server at first
const numberOfUpdates = 100; // the number of ping / updates that will be provided by all vehicules
let locationsDataQueue = new Array();
let activeLocationsData = new Array();
for (let i = 0; i < numberOfSession; i++) {
    let randomLocationData = generateRandomLocationData();
    activeLocationsData.push(randomLocationData);
    locationsDataQueue.push(randomLocationData);
}
for (let i = 0; i < numberOfUpdates; i++) {
    const chosenLocationDataId = generateRandomNumber(0, activeLocationsData.length - 1);
    activeLocationsData[chosenLocationDataId] = moveLocationData(activeLocationsData[chosenLocationDataId]);
    locationsDataQueue.push(activeLocationsData[chosenLocationDataId]);
}
const fileName = 'data.json';
let dataString = '';
for (let i = 0; i < locationsDataQueue.length; i++) {
    (0, KafkaClient_1.KafkaClient)(JSON.stringify(locationsDataQueue[i]));
    dataString += JSON.stringify(locationsDataQueue[i]) + "\n";
}
console.log(`Saved ${locationsDataQueue.length} LocationData related to ${numberOfSession} unique session inside ${fileName}`);
fs_1.default.writeFile(fileName, dataString, () => { });
