import combineChartDimensions from './combineChartDimensions';
import { useEffect, useRef, useState } from 'react';

import { ResizeObserver } from '@juggle/resize-observer';

const useChartDimensions = (passedSettings) => {
	const ref = useRef();
	const dimensions = combineChartDimensions(passedSettings);

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		if (dimensions.width && dimensions.height) return [ref, dimensions];

		const element = ref.current;
		const resizeObserver = new ResizeObserver((entries) => {
			if (!Array.isArray(entries)) return;
			if (!entries.length) return;

			const entry = entries[0];

			if (width != entry.contentRect.width)
				setWidth(entry.contentRect.width);
			if (height != entry.contentRect.height)
				setHeight(entry.contentRect.height);
		});
		resizeObserver.observe(element);

		return () => resizeObserver.unobserve(element);
	}, []);

	const newSettings = combineChartDimensions({
		...dimensions,
		width: dimensions.width || width,
		height: dimensions.height || height,
	});

	return [ref, newSettings];
};

export default useChartDimensions;
