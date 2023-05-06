const combineChartDimensions = (dimensions) => {
	const parsedDimensions = {
		...dimensions,
		marginTop: dimensions.marginTop || 10,
		marginRight: dimensions.marginRight || 10,
		marginBottom: dimensions.marginBottom || 40,
		marginLeft: dimensions.marginLeft || 75,
	};
	return {
		...parsedDimensions,
		boundedHeight: Math.max(
			parsedDimensions.height -
				parsedDimensions.marginTop -
				parsedDimensions.marginBottom,
			0
		),
		boundedWidth: Math.max(
			parsedDimensions.width -
				parsedDimensions.marginLeft -
				parsedDimensions.marginRight,
			0
		),
	};
};

export default combineChartDimensions;
