# How to extract the road network dataset on which the car simulateur will work on:

To extract the road network dataset for a car simulator using [OpenStreetMap](https://wiki.openstreetmap.org) (OSM) data, you can follow these steps:

- Download the desired dataset for the target country from a reliable source like http://download.geofabrik.de/. This source provides OSM data by countries.
- Outline the geographical borders of the area you want to focus on for the simulation. You can use a tool like https://www.informationfreeway.org/ to outline the borders.
- Some existing region already have a defined poly file border that outlines the target area that you can obtain the from a repository such as https://github.com/jameschevalier/cities. This file will help extract data specific to your area of interest.
- Extract the OSM data in the .osm format for the target area. Use the following command, assuming you have the osmconvert64.exe tool and the necessary files (tunisia-latest.osm.pbf and zone_border.poly) in the same directory:
  ``` cmd
  osmconvert64.exe tunisia-latest.osm.pbf -B=zone_border.poly -o=tunis.osm
  ```
- Filter the extracted data to include only the road elements. Since the "highway" tag in the OSM dataset encompasses all types of roads. You can use the following command with the osmfilter.exe tool:
  ``` cmd
  osmfilter.exe tunis.osm --keep="highway=" -o=tunis-road.osm
  ```
- Convert the filtered .osm file to GeoJSON format using the osmtogeojson tool. Execute the following command:: 
  ``` cmd
  osmtogeojson tunis-road.osm > tunis-road.geojson
  ```

By following these steps, you should have a road network dataset in GeoJSON format that we can use as input for our data generator
