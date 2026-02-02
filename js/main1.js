mapboxgl.accessToken = 'pk.eyJ1IjoibXJpY2hlcnQiLCJhIjoiY21oNTl4NnlxMDVqdTJqb205aDFmcWU2ZSJ9.0TGc-97aSBJ8xmNjTjjbuw';

        const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/light-v10', // style URL
                zoom: 3.75, // starting zoom
                center: [-100, 40], // starting center
            }
        );

        const layers = [
            '4.492 - 40.036',
            '40.037 - 62.551',
            '62.552 - 86.020',
            '86.021 - 124.393',
            '124.394 - 291.297'];

        const colors = [
            '#FED7D6',
            '#FDB0A1',   
            '#FA896F',   
            '#F25E3C',  
            '#E51C13'];

        const legend = document.getElementById('legend');
                    legend.innerHTML = "<b>Covid-19 Rates<br>(cases/1k people)</b><br><br>";

                    layers.forEach((layer, i) => {
                        const color = colors[i];
                        const item = document.createElement('div');
                        const key = document.createElement('span');
                        key.className = 'legend-key';
                        key.style.backgroundColor = color;

                        const value = document.createElement('span');
                        value.innerHTML = `${layer}`;
                        item.appendChild(key);
                        item.appendChild(value);
                        legend.appendChild(item);
                    });

        async function geojsonFetch() { 
            let response = await fetch('./assets/us-covid-2020-rates.json');
            let countyData = await response.json();
        
            map.on('load', function loadingData() {
                map.addSource('countyData', {
                    type: 'geojson',
                    data: countyData
                });

                map.addLayer({
                    'id': 'countyData-layer',
                    'type': 'fill',
                    'source': 'countyData',
                    'paint': {
                        'fill-color': [
                            'step',
                            ['get', 'rates'],
                            '#FED7D6',   // stop_output_0
                            40.036,          // stop_input_0
                            '#FDB0A1',   // stop_output_2
                            62.551,          // stop_input_2
                            '#FA896F',   // stop_output_4
                            86.02,         // stop_input_4
                            '#F25E3C',   // stop_output_5
                            124.393,         // stop_input_5
                            '#E51C13',   // stop_output_6
                        ],
                        'fill-outline-color': '#858181',
                        'fill-opacity': 0.7,
                    }
                });

                

    
            });

        map.on('mousemove', ({point}) => {
            const county = map.queryRenderedFeatures(point, {
                layers: ['countyData-layer']
            });
            document.getElementById('text-description').innerHTML = county.length ?
                `<h3>${county[0].properties.county}, ${county[0].properties.state}</h3>
                <p><strong><em>${county[0].properties.rates}</strong> cases per 1,000 people</em></p>` :
                `<p>Hover over a county to see its COVID-19 rate.</p>`;
        });

        }

        geojsonFetch();

    