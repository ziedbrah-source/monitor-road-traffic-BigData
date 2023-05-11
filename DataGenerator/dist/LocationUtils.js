"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomItem = exports.getDistanceInMeters = exports.getLocationsGraph = exports.getCoordID = exports.getRoadsFeature = exports.nodeGraph = exports.node = void 0;
class node {
}
exports.node = node;
;
class nodeGraph {
}
exports.nodeGraph = nodeGraph;
;
function getRoadsFeature(features) {
    const roads = [];
    // Iterate over the GeoJSON features
    features.forEach(feature => {
        // Check if the feature is a LineString and has a "highway" property
        if (feature.geometry.type === 'LineString' && feature.properties.hasOwnProperty('highway')) {
            // Add the feature to the roads list
            roads.push(feature);
        }
    });
    return roads;
}
exports.getRoadsFeature = getRoadsFeature;
function getCoordID(coord) {
    return coord[0] + '-' + coord[1];
}
exports.getCoordID = getCoordID;
function getLocationsGraph(roadFeatures) {
    let LocationsNodes = {};
    roadFeatures.forEach(road => {
        const coords = road.geometry.coordinates;
        for (let i = 0; i < coords.length; i++) {
            const curr = coords[i];
            if (!(getCoordID(curr) in LocationsNodes)) {
                LocationsNodes[getCoordID(curr)] = {
                    key: getCoordID(curr),
                    coord: curr,
                    neighbours: [],
                };
            }
            if (i !== 0) {
                LocationsNodes[getCoordID(curr)].neighbours.push(getCoordID(coords[i - 1]));
            }
            if (i !== coords.length - 1) {
                LocationsNodes[getCoordID(curr)].neighbours.push(getCoordID(coords[i + 1]));
            }
        }
    });
    return LocationsNodes;
}
exports.getLocationsGraph = getLocationsGraph;
function getDistanceInMeters(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const earthRadius = 6371000; // meters
    const latDiff = toRadians(lat2 - lat1);
    const lonDiff = toRadians(lon2 - lon1);
    const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
}
exports.getDistanceInMeters = getDistanceInMeters;
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}
function getRandomItem(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}
exports.getRandomItem = getRandomItem;
