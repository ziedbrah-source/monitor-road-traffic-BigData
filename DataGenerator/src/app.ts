import fs from 'fs';
import { LocationData } from './LocationData';
import _ from 'lodash'
import { KafkaClient } from "./KafkaClient"
import { Feature, GeoJsonObject, Geometry, GeoJSON } from 'geojson';
import { RoadFeature } from './RoadFeature';
import { nodeGraph, getRandomItem, getCoordID, node, getLocationsGraph, getRoadsFeature, getDistanceInMeters } from './LocationUtils';

// Load the OSM data from tunis-road.geojson

const tunis_roads = fs.readFileSync('./tunis-road.geojson', 'utf-8');
const geojson: GeoJSON.FeatureCollection = JSON.parse(tunis_roads);

const roadFeatures: RoadFeature[] = getRoadsFeature(geojson.features);

const locationGraph: nodeGraph = getLocationsGraph(roadFeatures);
let allLocations: node[] = Object.values(locationGraph);
let visitedLocationByMacAdress = {}
let currentNodeIdByMacAdress = {}

// let na = locationGraph[getCoordID([
//     10.2142654,
//     36.8474979
// ])].neighbours;
// console.log(getDistanceInMeters(locationGraph[na[0]].coord, locationGraph[na[1]].coord))

let currentFictiveTimeStamp = Date.now();


function generateRandomDouble(lowerBound: number, upperBound: number): number {
    return Math.random() * (upperBound - lowerBound) + lowerBound;
}

function generateRandomNumber(lowerBound: number, upperBound: number, step: number = 1): number {
    const random: number = Math.floor(generateRandomDouble(lowerBound, upperBound));
    return random - random % step;
}

function generateSessionId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomMacAddress(): string {
    const hexChars: string = '0123456789ABCDEF';
    let macAddress: string = '';

    for (let i = 0; i < 6; i++) {
        let segment: string = '';
        for (let j = 0; j < 2; j++) {
            const randomIndex: number = Math.floor(Math.random() * hexChars.length);
            segment += hexChars[randomIndex];
        }
        macAddress += `${segment}${i < 5 ? ':' : ''}`;
    }

    return macAddress;
}

function generateRandomCoordinates(minLat: number, maxLat: number, minLon: number, maxLon: number): { lat: number, lng: number } {
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lng = Math.random() * (maxLon - minLon) + minLon;
    return { lat, lng };
}

function getRandomDeviceBrand(): string {
    const smartphoneBrands: string[] = [
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
    return smartphoneBrands[generateRandomNumber(0, smartphoneBrands.length)]
}

function generateRandomLocationData(): LocationData {
    const data = new LocationData();
    currentFictiveTimeStamp += generateRandomNumber(1, 1000);

    const currCoordinates = getRandomItem(allLocations);
    data.lat = currCoordinates.coord[0].toString();
    data.lng = currCoordinates.coord[1].toString();
    data.macAddress = generateRandomMacAddress().toString();
    data.sessionId = generateSessionId().toString();
    data.session_start_timestamp = currentFictiveTimeStamp.toString();
    data.timestamp = currentFictiveTimeStamp.toString();
    data.devicebrand = getRandomDeviceBrand();
    var number = generateRandomNumber(0, 160);
    data.speed = `${number} km/h`;
    data.alert = number > 100 ? "true" : "false";
    visitedLocationByMacAdress[data.macAddress] = new Set<string>([getCoordID(currCoordinates.coord)]);
    currentNodeIdByMacAdress[data.macAddress] = getCoordID(currCoordinates.coord);
    return data;
}

function findFirstMissing(allKeys: string[], takenKeys: Set<string>) {
    for (const element of allKeys) {
        if (!takenKeys.has(element)) {
            return element;
        }
    }
    return null;
}

function moveLocationData(locationsData: LocationData): LocationData {
    const locationDataToMove: LocationData = _.cloneDeep(locationsData);

    currentFictiveTimeStamp += generateRandomNumber(1000, 3000);
    locationDataToMove.timestamp = currentFictiveTimeStamp.toString();
    let currentnode: node = locationGraph[currentNodeIdByMacAdress[locationsData.macAddress]];

    let newCordKey = findFirstMissing(currentnode.neighbours, visitedLocationByMacAdress[data.macAddress]);

    if (newCordKey === null) {
        locationDataToMove.alert = "false";
        locationDataToMove.speed = "0 km/h";
        return locationDataToMove;
    }

    let newCord = locationGraph[newCordKey];
    visitedLocationByMacAdress[locationsData.macAddress].add(newCordKey);

    locationDataToMove.lat = newCord.coord[0].toString();
    locationDataToMove.lng = newCord.coord[1].toString();
    const arr = locationDataToMove.speed.split(" ");
    var speed=generateRandomNumber(Math.max(0,+arr[0]-40), Math.min(+arr[0]+40,160));
    locationDataToMove.alert= +arr[0]>100?"true":"false";
    locationDataToMove.speed=`${speed} km/h`;

    return locationDataToMove;
};

let data: LocationData = generateRandomLocationData();


const numberOfSession: number = 10; // how many vehicule will connect to the server at first
const numberOfUpdates: number = 100; // the number of ping / updates that will be provided by all vehicules

let locationsDataQueue: Array<LocationData> = new Array<LocationData>();
let activeLocationsData: Array<LocationData> = new Array<LocationData>();


for (let i = 0; i < numberOfSession; i++) {
    let randomLocationData = generateRandomLocationData();
    activeLocationsData.push(randomLocationData);
    locationsDataQueue.push(randomLocationData);
}

for (let i = 0; i < numberOfUpdates; i++) {
    const chosenLocationDataId: number = generateRandomNumber(0, activeLocationsData.length - 1);
    activeLocationsData[chosenLocationDataId] = moveLocationData(activeLocationsData[chosenLocationDataId]);
    locationsDataQueue.push(activeLocationsData[chosenLocationDataId]);
}


const fileName: string = 'data.json';

let dataString: string = '';
for (let i = 0; i < locationsDataQueue.length; i++) {
    KafkaClient(JSON.stringify(locationsDataQueue[i]));
    dataString+=JSON.stringify(locationsDataQueue[i])+"\n";
}

console.log(`Saved ${locationsDataQueue.length} LocationData related to ${numberOfSession} unique session inside ${fileName}`);
fs.writeFile(fileName, dataString, () => { });