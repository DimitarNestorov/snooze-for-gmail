const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const externals = {}
Object.keys(require('./package.json').dependencies).forEach(key => {
	externals[key] = `commonjs ${key}`
})

module.exports = {
	entry: './src/index',
	output: {
		filename: 'index.js',
		libraryTarget: 'this',
	},
	devtool: 'source-map',
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
	],
	externals,
}