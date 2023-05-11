- extract data:
    osmconvert64.exe tunisia-latest.osm.pbf -B=zone_border.poly -o=tunis.osm
- To outline Geographical Borders (osm tool)  https://www.informationfreeway.org/
- to get poly file https://github.com/jameschevalier/cities

-filter over road only

- convert .osm to greojson
    - osmtogeojson tunis-road.osm > tunis-road.geojson