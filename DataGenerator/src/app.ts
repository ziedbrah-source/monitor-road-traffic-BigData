import fs from 'fs';
import { LocationData } from './LocationData';
import _ from 'lodash'
import {KafkaClient} from "./KafkaClient"


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

    const coordinates = generateRandomCoordinates(0, 10, 0, 10);
    data.lat=coordinates.lat.toString();
    data.lng= coordinates.lng.toString();
    data.macAddress = generateRandomMacAddress().toString();
    data.sessionId = generateSessionId().toString();
    data.session_start_timestamp = currentFictiveTimeStamp.toString();
    data.timestamp = currentFictiveTimeStamp.toString();
    data.devicebrand = getRandomDeviceBrand();
    var number=generateRandomNumber(0, 160);
   // console.log(number);
    data.speed = `${number} km/h`;
    data.alert= number>100?"true":"false";
    return data;
}

function moveLocationData(locationsData: LocationData): LocationData {
    const locationDataToMove: LocationData = _.cloneDeep(locationsData);

    currentFictiveTimeStamp += generateRandomNumber(1, 1000);
    locationDataToMove.timestamp = currentFictiveTimeStamp.toString();
    locationDataToMove.lat = (+locationDataToMove.lat +generateRandomDouble(-0.001, 0.001)).toString();
    locationDataToMove.lng = (+locationDataToMove.lng+generateRandomDouble(-0.001, 0.001)).toString();
    const arr=locationDataToMove.speed.split(" ");
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
}

console.log(`Saved ${locationsDataQueue.length} LocationData related to ${numberOfSession} unique session inside ${fileName}`);
fs.writeFile(fileName, dataString, () => { });