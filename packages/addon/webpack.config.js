const path = require('path')

const baseConfig = require('../../webpack.config.js')

module.exports = {
	...baseConfig,

	entry: [
		'./loaders/appsscript-loader.js!./src/appsscript.json',
		// './src/globalThis',
		'./src/index',
	],
	output: {
		filename: 'index.js',
		libraryTarget: 'this',
	},
	optimization: {
		minimize: false,
	},
}
