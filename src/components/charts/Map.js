import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

// const geoDataPath = '../../../public/data/world-geojson2.json';
// const wb_data = '../../../public/data/wb_food_data.csv';

import geo_data from '../../../public/data/world-geojson2.json';
import wb_data from '../../../public/data/wb_food_data.json';

import useChartDimensions from '@/hooks/useChartDimensions';

function HoverBox({}) {}

function Map() {
	const [geodata, setGeodata] = useState(null);
	const [worldBankData, setWorldBankData] = useState(null);
	const [metricDataByCountry, setMetricDataByCountry] = useState({});
	const [colourScale, setColourScale] = useState();
	const [hoverData, setHoverData] = useState({
		country: 'nil',
		stat: 'nil',
		x: 0,
		y: 0,
	});

	// # D3 Setup Params
	const [ref, dimensions] = useChartDimensions({});
	const sphere = { type: 'Sphere' };
	const projection = d3
		.geoEqualEarth()
		.fitWidth(dimensions.boundedWidth, sphere);

	const geoPath = d3.geoPath(projection);

	console.log('dimensions', dimensions);

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

	const legendWidth = 120;
	const legendHeight = 20;

	// Interaction functions
	function handleMouseEnter(datum) {
		const tooltip = d3.select('#tooltip');
		const countryId = countryIDAccessor(datum);
		const metricValue = metricDataByCountry[countryId] || 'nil';
		const [x, y] = geoPath.centroid(datum);

		setHoverData({
			country: countryNameAccessor(datum),
			stat: metricValue,
			x: x,
			y: y,
		});

		tooltip.style('opacity', '1');

		const hoverMark = d3.select('#hoverMark').style('opacity', '1');

		console.log('mouseEnter', datum);
	}

	function handleMouseLeave(datum) {
		const tooltip = d3.select('#tooltip');

		tooltip.style('opacity', '0');
		console.log('mouseLeave', datum);
	}

	return (
		<div
			ref={ref}
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div>
				<div
					id="tooltip"
					className="p-3 bg-red-400"
					style={{
						opacity: 0,
            width: 'max-content',
						position: 'relative',
						zIndex: 1000,
						top: hoverData.y,
						left: hoverData.x,
					}}
				>
					<div id="country">{hoverData.country}</div>
					<div id="stat">
						<span id="value">
							{hoverData.stat == '..'
								? 'No Data'
								: hoverData.stat + '%'}
						</span>{' '}
					</div>
				</div>

				<svg width={dimensions.boundedWidth} height={height}>
					<defs>
						{/* Everything outside the circle will be clipped and therefore invisible. */}
						<clipPath id="map_sphere">
							<path d={geoPath(sphere)} />
						</clipPath>
					</defs>

					{/* Draw the earth */}
					<path
						d={geoPath(sphere)}
						fill="#4761ad"
						color="#f2f2f7"
					></path>

					{/* Draw the countries within the boundries established by clipPath*/}

					<g clipPath="url(#map_sphere)">
						{/* Draw some graticules */}
						<path
							d={geoPath(d3.geoGraticule10())}
							fill="none"
							stroke="#fff"
							strokeWidth="0.5"
							strokeOpacity="0.5"
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
										key={countryNameAccessor(feature)}
										d={geoPath(feature)}
										fill={colourScale(metricValue)}
										stroke="#e4e4e8"
										strokeWidth="0.5"
										opacity={metricValue ? 1 : 0.5}
										onMouseEnter={() => {
											console.log(
												'mouseEnter',
												countryNameAccessor(feature)
											);
											handleMouseEnter(feature);
										}}
										onMouseLeave={() => {
											console.log(
												'mouseLeave',
												countryNameAccessor(feature)
											);
											handleMouseLeave(feature);
										}}
									/>
								);
							})}
					</g>
					<circle
						id="hoverMark"
						cx={hoverData.x}
						cy={hoverData.y}
						r={4}
						fill="red"
						style={{ opacity: 0 }}
					></circle>
				</svg>
			</div>

			{/* Draw Legend */}
			<div style={{ margin: '1rem 0 0 0' }}>
				<h6
					style={{
						textAlign: 'center',
						padding: '0.5rem 0',
						fontFamily: 'sans-serif',
					}}
				>
					{metric}
				</h6>
				{/* <span>{d3.max(Object.values(metricDataByCountry))}%</span> */}
				<svg height={legendHeight} width={dimensions.boundedWidth}>
					<defs>
						<linearGradient id="gradient">
							<stop offset="0%" stopColor="#e4e4e8" />
							<stop offset="100%" stopColor="#61ad47" />
						</linearGradient>
					</defs>
					<g>
						<rect
							x={dimensions.boundedWidth / 2 - legendWidth / 2}
							height={legendHeight}
							width={legendWidth}
							style={{
								fill: 'url(#gradient)',
							}}
						></rect>
						<text
							x={
								dimensions.boundedWidth / 2 -
								legendWidth / 2 -
								19
							}
							y={legendHeight - 5}
						>
							0
						</text>
						<text
							x={
								dimensions.boundedWidth / 2 +
								legendWidth / 2 +
								30
							}
							y={legendHeight - 5}
							style={{ textAnchor: 'end' }}
						>
							{d3.max(Object.values(metricDataByCountry))}
						</text>
					</g>
				</svg>
			</div>
		</div>
	);
}

export default Map;
