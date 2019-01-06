const CopyPlugin = require('copy-webpack-plugin')

const baseConfig = require('../../webpack.config.js')

baseConfig.plugins.push(new CopyPlugin([
	'index.html',
	'terms.html',
	'privacy.html',
	{ from: '../../../resources/logo.png', to: 'logo.png' },
	{ from: '../../../resources/logo.svg', to: 'logo.svg' },
], {
	context: 'src',
}))

module.exports = {
	...baseConfig,

	optimization: {},
}
