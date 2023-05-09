import { useEffect, useState } from 'react';
import useChartDimensions from '@/hooks/useChartDimensions';
import * as d3 from 'd3';

// Data
import insuranceDataKaggle from '../../../public/data/insurance_data_kaggle.json';

function Scatterplot() {
	const [ref, dimensions] = useChartDimensions({});
	const [data, setData] = useState(null);

	console.log('# dimensions', dimensions);
	console.log('# data', insuranceDataKaggle);

	async function getData() {
		setData(insuranceDataKaggle);
	}

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (data) {
			const wrapper = d3.select('#wrapper');

			// Establish accessors
			const xAccessor = (d) => d['bmi'];
			const yAccessor = (d) => d['charges'];

			// Establish scales
			const xScale = d3
				.scaleLinear()
				.domain([0, 0])
				.range([0, dimensions.boundedWidth])
				.nice();


      console.log('d3.max(data, yAccessor)', d3.max(data, yAccessor));
			const yScale = d3
				.scaleLinear()
				.domain([0, d3.max(data, yAccessor)])
				.range([dimensions.boundedHeight, 0])
				.nice();

			// Draw axes
			// x-axis
			wrapper
				.append('g')
				.call(d3.axisBottom(xScale))
				.attr('transform', `translate(0, ${dimensions.boundedHeight})`)
				.attr('id', 'xAxis')
				.attr('opacity', 0);

			// y-axis
			wrapper.append('g').call(d3.axisLeft(yScale)).attr('id', 'yAxis');

			// Draw data
			wrapper
				.selectAll('circle')
				.data(data)
				.join('circle')
				.attr('cx', (d) => xScale(xAccessor(d)))
				.attr('cy', (d) => yScale(yAccessor(d)))
				.attr('r', 2)
				.attr('fill', 'red');

			// Draw the "after trasnition" state of x-axis
			xScale.domain([0, 300]);
			wrapper
				.select('#xAxis')
				.transition()
				.duration(1000)
				.attr('opacity', 1)
				.call(d3.axisBottom(xScale));

			// Draw the "after trasnition" state of data points
			wrapper
				.selectAll('circle')
				.transition()
				.delay((d, i) => i * 10)
				.duration(1000)
				.attr('cx', (d) => xScale(xAccessor(d)))
				.attr('cy', (d) => yScale(yAccessor(d)));
		}
	}, [data]);

	return (
		<div
			ref={ref}
			style={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
        padding: '4rem',
			}}
		>
			<h1>Scatterplot</h1>
			<svg
				width={dimensions.width}
				height={1000}
				id="wrapper"
			></svg>
		</div>
	);
}

export default Scatterplot;
