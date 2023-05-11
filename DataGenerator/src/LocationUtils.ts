import { RoadFeature } from './RoadFeature';
import { Graph } from 'graphlib';


export class node {
    key: string;
    coord: [number, number];
    neighbours: string[];
};

export class nodeGraph { [key: string]: node };

export function getRoadsFeature(features: any): RoadFeature[] {
    const roads: RoadFeature[] = [];

    // Iterate over the GeoJSON features
    features.forEach(feature => {
        // Check if the feature is a LineString and has a "highway" property
        if (feature.geometry.type === 'LineString' && feature.properties.hasOwnProperty('highway')) {
            // Add the feature to the roads list
            roads.push(feature as RoadFeature);
        }
    });
    return roads;
}

export function getCoordID(coord: number[]) {
    return coord[0] + '-' + coord[1];
}

export function getLocationsGraph(roadFeatures: any[]): nodeGraph {
    let LocationsNodes: nodeGraph = {};

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
                LocationsNodes[getCoordID(curr)].neighbours.push(getCoordID(coords[i - 1]))
            }

            if (i !== coords.length - 1) {
                LocationsNodes[getCoordID(curr)].neighbours.push(getCoordID(coords[i + 1]))
            }
        }
    });
    return LocationsNodes;
}

export function getDistanceInMeters(coord1: [number, number], coord2: [number, number]): number {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const earthRadius = 6371000; // meters
    const latDiff = toRadians(lat2 - lat1);
    const lonDiff = toRadians(lon2 - lon1);

    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}

function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}

export function getRandomItem<T>(list: T[]): T {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}