function reducer(accumulator, key) {
	const regex = new RegExp(`\%${key}\%`, 'g')
	return accumulator.replace(regex, process.dotEnv[key])
}

module.exports = function (source) {
	const result = Object.keys(process.dotEnv).reduce(reducer, source)
	this.emitFile('appsscript.json', result)
	return "{}"
}
