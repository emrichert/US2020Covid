mapboxgl.accessToken =
    'pk.eyJ1IjoibXJpY2hlcnQiLCJhIjoiY21tMGhreHJ4MDB5MTJycHdvMXVybW53eCJ9.d7Y9txTkKEUMLCEmdYvpaw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.75, // starting zoom
    minZoom: 2, // minimum zoom level of the map
    center: [-100, 40] // starting center
});

const grades = [24465, 115697, 390927, 756412],
    colors = ['rgb(230, 231, 249)', 'rgb(127, 178, 207)', 'rgb(45, 92, 210)', 'rgb(13, 8, 63)'],
    radii = [5, 15, 20, 25];
//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('cases', {
        type: 'geojson',
        data: './assets/us-covid-2020-counts.json'
    });
    map.addLayer({
            'id': 'cases-point',
            'type': 'circle',
            'source': 'cases',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], radii[0]],
                        [grades[1], radii[1]],
                        [grades[2], radii[2]],
                        [grades[3], radii[3]]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.7
            }
        }
    );
    // click on tree to view magnitude in a popup
    map.on('click', 'cases-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong> County:</strong> ${event.features[0].properties.county}, ${event.features[0].properties.state} <br>
                <strong>Case count:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>Covid-19 Case Count</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    if (i === 0) {
        vbreak = '1 - ' + grades[i];
        } else {
        vbreak = (grades[i - 1] + 1) + ' - ' + grades[i];
        }
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NYT</a></p>';
legend.innerHTML = labels.join('') + source;