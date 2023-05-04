import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const data = [10, 20, 30, 40, 50];

function LineChart() {
	const svgRef = useRef();
  
  // FIXME: if we want out going animations and additional facny stuff, we need to use the enter, update, exit pattern
  // .join(
  // 	(enter) => enter.append('circle')		
  // 	(update) => update.attr('class', 'updated'),
  // 	(exit) => exit.remove()
  // )

	useEffect(() => {
		console.log('svgRef', svgRef);
		const svg = d3
			.select(svgRef.current)
			.data(data)
      .join("circle")
						.attr('r', (d) => d)
						.attr('cx', (d) => d*2)
						.attr('cy', (d) => d*2)
            .attr('stroke', 'red')
	}, []);

	return (
		<div>
			<h1>LineChart</h1>
			<svg ref={svgRef}></svg>
		</div>
	);
}

export default LineChart;
