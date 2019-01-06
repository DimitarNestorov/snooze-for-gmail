const path = require('path')

const baseConfig = require('../../webpack.config.js')

module.exports = {
	...baseConfig,

	entry: [
		'./src/appsscript.json',
		// './src/globalThis',
		'./src/index',
	],
	output: {
		filename: 'index.js',
		libraryTarget: 'this',
	},
	resolveLoader: {
		modules: [path.join(__dirname, 'loaders'), 'node_modules'],
	},
	module: {
		rules: [
			...baseConfig.module.rules,
			{
				test: /appsscript\.json$/,
				use: "appsscript-loader",
			},
		]
	},
	optimization: {
		minimize: false,
	},
}
