"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const LocationData_1 = require("./LocationData");
const lodash_1 = __importDefault(require("lodash"));
const KafkaClient_1 = require("./KafkaClient");
const LocationUtils_1 = require("./LocationUtils");
// Load the OSM data from tunis-road.geojson
const tunis_roads = fs_1.default.readFileSync('./tunis-road.geojson', 'utf-8');
const geojson = JSON.parse(tunis_roads);
const roadFeatures = (0, LocationUtils_1.getRoadsFeature)(geojson.features);
const locationGraph = (0, LocationUtils_1.getLocationsGraph)(roadFeatures);
let allLocations = Object.values(locationGraph);
let visitedLocationByMacAdress = {};
let currentNodeIdByMacAdress = {};
// let na = locationGraph[getCoordID([
//     10.2142654,
//     36.8474979
// ])].neighbours;
// console.log(getDistanceInMeters(locationGraph[na[0]].coord, locationGraph[na[1]].coord))
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
    const currCoordinates = (0, LocationUtils_1.getRandomItem)(allLocations);
    data.lng = currCoordinates.coord[0].toString();
    data.lat = currCoordinates.coord[1].toString();
    data.macAddress = generateRandomMacAddress().toString();
    data.sessionId = generateSessionId().toString();
    data.session_start_timestamp = currentFictiveTimeStamp.toString();
    data.timestamp = currentFictiveTimeStamp.toString();
    data.devicebrand = getRandomDeviceBrand();
    var number = generateRandomNumber(0, 160);
    data.speed = `${number} km/h`;
    data.alert = number > 100 ? "true" : "false";
    visitedLocationByMacAdress[data.macAddress] = new Set([(0, LocationUtils_1.getCoordID)(currCoordinates.coord)]);
    currentNodeIdByMacAdress[data.macAddress] = (0, LocationUtils_1.getCoordID)(currCoordinates.coord);
    return data;
}
function findFirstMissing(allKeys, takenKeys) {
    for (const element of allKeys) {
        if (!takenKeys.has(element)) {
            takenKeys.add(element);
            return element;
        }
    }
    return null;
}
function moveLocationData(locationsData) {
    const locationDataToMove = lodash_1.default.cloneDeep(locationsData);
    currentFictiveTimeStamp += generateRandomNumber(1000, 3000);
    locationDataToMove.timestamp = currentFictiveTimeStamp.toString();
    let currentnode = locationGraph[currentNodeIdByMacAdress[locationsData.macAddress]];
    let newCordKey = findFirstMissing(currentnode.neighbours, visitedLocationByMacAdress[data.macAddress]);
    visitedLocationByMacAdress[locationsData.macAddress].add(newCordKey);
    currentNodeIdByMacAdress[locationsData.macAddress] = newCordKey;
    if (newCordKey === null || currentnode === null) {
        console.log("w7ell");
        locationDataToMove.alert = "false";
        locationDataToMove.speed = "0 km/h";
        return null;
    }
    currentNodeIdByMacAdress[locationsData.macAddress] = newCordKey;
    let newCord = locationGraph[newCordKey];
    locationDataToMove.lng = newCord.coord[0].toString();
    locationDataToMove.lat = newCord.coord[1].toString();
    const arr = locationDataToMove.speed.split(" ");
    var speed = generateRandomNumber(Math.max(0, +arr[0] - 40), Math.min(+arr[0] + 40, 160));
    locationDataToMove.alert = +arr[0] > 100 ? "true" : "false";
    locationDataToMove.speed = `${speed} km/h`;
    return locationDataToMove;
}
;
let data = generateRandomLocationData();
const numberOfSession = 20; // how many vehicule will connect to the server at first
const numberOfUpdates = 10000; // the number of ping / updates that will be provided by all vehicules
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
    if (activeLocationsData[chosenLocationDataId] == null) {
        activeLocationsData[chosenLocationDataId] = generateRandomLocationData();
    }
    locationsDataQueue.push(activeLocationsData[chosenLocationDataId]);
}
const fileName = 'data.json';
let dataString = '';
function sleep() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Before sleep");
        yield new Promise(resolve => setTimeout(resolve, 300));
    });
}
function sendData() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < locationsDataQueue.length; i++) {
            yield sleep();
            (0, KafkaClient_1.KafkaClient)(JSON.stringify(locationsDataQueue[i]));
            console.log(locationsDataQueue[i]);
            dataString += JSON.stringify(locationsDataQueue[i]) + "\n";
        }
        console.log(`Saved ${locationsDataQueue.length} LocationData related to ${numberOfSession} unique session inside ${fileName}`);
        fs_1.default.writeFile(fileName, dataString, () => { });
    });
}
sendData();
console.log(`Saved ${locationsDataQueue.length} LocationData related to ${numberOfSession} unique session inside ${fileName}`);
fs_1.default.writeFile(fileName, dataString, () => { });
