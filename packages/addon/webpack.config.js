const CopyPlugin = require('copy-webpack-plugin')

const baseConfig = require('../../webpack.config.js')

baseConfig.plugins.push(new CopyPlugin([
	'appsscript.json',
], {
	context: 'src',
}))

module.exports = {
	...baseConfig,

	// entry: ['./src/globalThis', './src/index'],
	output: {
		filename: 'index.js',
		libraryTarget: 'this',
	},
	optimization: {
		minimize: false,
	},
}
