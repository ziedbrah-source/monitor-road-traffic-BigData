export interface RoadFeature extends GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties> {
    properties: {
        highway: string;
    }
}