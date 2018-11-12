let formClass = function () {
	const classes = [...arguments];
	let resultClass = `btn ${classes.map(cl => {
		if (cl) {
			return `btn-${cl}`;
		}}).join(' ')} `;
	if(classes.includes('disabled')) {
		resultClass += 'disabled '
	}
	if(classes.includes('link')) {
		resultClass += 'link'
	}
	return resultClass;
};

export { formClass };
