# Where the coordinates come from

`data/geo.json` and `data/municipios.json` are static files, made once by hand. They are not rebuilt by the weekly Action.

- **Outline of Spain and Portugal**: Natural Earth 1:50m countries, public domain. The Balearic Islands are left out because they are not in the reservoir data.
- **Reservoir coordinates**: Wikidata (CC0). Every item that is a reservoir in Spain with coordinates, queried over SPARQL, then matched to the ministry's names with `match_reservoirs.py`. A match only counts if the point falls inside a rough box for that reservoir's river basin. A second pass accepts close spellings and was checked by eye. 306 of 375 reservoirs are located; the rest are simply not drawn on the map.
- **Municipalities**: Wikidata (CC0). Every municipality of Spain with an INE code and coordinates, sorted by population.

MITECO's official dam inventory would be the better source for reservoirs, but its download sits behind a captcha, so it is not used.
