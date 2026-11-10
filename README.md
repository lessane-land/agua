# Agua

Los embalses de España como un muro de agua. Cada ladrillo es un embalse: el tamaño es su capacidad, el agua es lo que tiene y la roca es lo que falta. Con un deslizador para ver esta misma semana en otros años, desde 1988.

Spain's reservoirs as a wall of water. Every brick is a reservoir: size is capacity, water is what it holds, rock is what is missing. A slider shows this same week in other years, back to 1988.

Live: https://agua.lessane.es

## How it works

- No build step. `index.html`, `assets/agua.css` and `assets/agua.js` are served as they are by GitHub Pages.
- `data/agua.json` is the only data file. `tools/build_data.py` (standard library Python, plus `mdbtools`) rebuilds it from MITECO's weekly history file. The visitor's browser never calls MITECO.
- `data/tesoros.json` (drowned places and dated sightings) and `data/vasos.json` (which reservoirs supply which city) are written by hand, with a source for every line. The script checks them against the bulletin and folds them into `data/agua.json`.
- `.github/workflows/datos.yml` runs the script twice a week and commits the file only when it changed.

## Run it locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. To rebuild the data: `sudo apt-get install mdbtools` and `python3 tools/build_data.py`.

## Data and credits

Origen de los datos: MITECO, Boletín Hidrológico semanal. Provisional, unvalidated data. Full credits in `creditos.html`.

No ads, no cookies, no tracking.
