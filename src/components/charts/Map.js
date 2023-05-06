import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

// const geoDataPath = '../../../public/data/world-geojson2.json';
// const wb_data = '../../../public/data/wb_food_data.csv';

import geo_data from '../../../public/data/world-geojson2.json';
import wb_data from '../../../public/data/wb_food_data.json';

// async function readCSV() {
//   const csv = await fs.readFile(wb_data);
//   const csvString = csv.toString('utf-8');
//   return papa.parse(csv, { worker: true, header: true }).data;
// }

function Map() {
	const [geodata, setGeodata] = useState(null);
	const [worldBankData, setWorldBankData] = useState(null);
	const [metricDataByCountry, setMetricDataByCountry] = useState({});

	const countryNameAccessor = (d) => d.properties.NAME;
	const countryIDAccessor = (d) => d.properties.ADM0_A3_IS;
	const metric = 'Prevalence of severe food insecurity in the population (%)';

	async function getData() {
		// geodata will be fetched via the API later
		setGeodata(geo_data);
		setWorldBankData(wb_data);
	}

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (geodata) {
			console.log('geodata', geodata);
			console.log('wb_data', worldBankData);
		}

		if (worldBankData) {
			let metricTemp = {};
			worldBankData.forEach((d, i) => {
				// if (i === 0) console.log("d['Series Name']", d['Series Name']);
				if (d['Series Name'] === metric) {
					metricTemp[d['Country Code']] = d['2016 [YR2016]'] || 0;
				}
			});
			console.log('# metricTemp', metricTemp);
			setMetricDataByCountry(metricTemp);
		}
	}, [geodata, worldBankData]);

	// D3 Setup Params
	const dimensions = {
		width: window.innerWidth * 0.9,
		margin: {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10,
		},
	};

  // Set boundedWidth by subtracting the left and right margins widths from the total width
	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;

	return <div></div>;
}

export default Map;
