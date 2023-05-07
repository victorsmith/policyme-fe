import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

// const geoDataPath = '../../../public/data/world-geojson2.json';
// const wb_data = '../../../public/data/wb_food_data.csv';

import geo_data from '../../../public/data/world-geojson2.json';
import wb_data from '../../../public/data/wb_food_data.json';

import useChartDimensions from '@/hooks/useChartDimensions';

function Map() {
	const [geodata, setGeodata] = useState(null);
	const [worldBankData, setWorldBankData] = useState(null);
	const [metricDataByCountry, setMetricDataByCountry] = useState({});
	const [colourScale, setColourScale] = useState();

	// # D3 Setup Params
	const [ref, dimensions] = useChartDimensions({});
	const sphere = { type: 'Sphere' };
	const projection = d3
		.geoEqualEarth()
		.fitWidth(dimensions.boundedWidth, sphere);
	const geoPath = d3.geoPath(projection);

	// size the svg to fit the height of the map
	const [[x0, y0], [x1, y1]] = geoPath.bounds(sphere);
	const height = y1;

	console.log('height', height);

	// Accessor Functions
	const countryNameAccessor = (d) => d.properties.NAME;
	const countryIDAccessor = (d) => d.properties.ADM0_A3_US;

	const metric = 'Prevalence of severe food insecurity in the population (%)';

	// # Handle Data Fetching
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
			2;
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

	useEffect(() => {
		const metricValues = Object.values(metricDataByCountry);
		const metricValueExtent = d3.extent(metricValues);

		// Swap the min of ".." to 0 for the scale function
		// We will use a special case for ".." in the fill function
		metricValueExtent[0] = 0;
		const domainValues = [-1, ...metricValueExtent];

		const colourScale = d3
			.scaleLinear()
			.domain(domainValues)
			.range(['#000000', '#e4e4e8', '#61ad47']);

		console.log('metricDataByCountry', metricDataByCountry);
		setColourScale(() => colourScale);
	}, [metricDataByCountry]);

	return (
		<div
			ref={ref}
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<svg width={dimensions.width} height={height}>
				<defs>
					{/* Everything outside the circle will be clipped and therefore invisible. */}
					<clipPath id="map_sphere">
						<path d={geoPath(sphere)} />
					</clipPath>
				</defs>

				{/* Draw the earth */}
				<path d={geoPath(sphere)} fill="#4761ad" color="#f2f2f7"></path>

				{/* Draw the countries within the boundries established by clipPath*/}
				<g clipPath="url(#map_sphere)">
					{/* Draw some graticules */}
					<path
						d={geoPath(d3.geoGraticule10())}
						fill="none"
						stroke="#fff"
						strokeWidth="0.5"
					/>

					{/* Draw the countries */}
					{geodata &&
						colourScale &&
						geodata.features.map((feature, i) => {
							{
								/* Get the metric data. If the value is "..", assign 0 val */
							}
							const metricValue =
								metricDataByCountry[
									countryIDAccessor(feature)
								] || -1;

							return (
								<path
									key={i}
									d={geoPath(feature)}
									fill={colourScale(metricValue)}
									stroke="#e4e4e8"
									strokeWidth="0.5"
									opacity={metricValue ? 1 : 0.5}
								/>
							);
						})}
				</g>
			</svg>
		</div>
	);
}

export default Map;
