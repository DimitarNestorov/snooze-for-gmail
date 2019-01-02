const CopyWebpackPlugin = require('copy-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
	entry: ['./src/globalThis', './src/index'],
	output: {
		libraryTarget: 'this',
	},
	devtool: 'none',
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
		],
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new CopyWebpackPlugin([
			'appsscript.json',
		], {
			context: 'src',
		}),
	],
	optimization: {
		minimize: false,
	},
}
