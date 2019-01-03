const fs = require('fs')
const path = require('path')

const dotenv = require('dotenv')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')


// #region Define plugin configuration
const dotenvPath = path.join(__dirname, '.env')
const dotenvPathExample = path.join(__dirname, '.env.example')
const exitstsDotenv = fs.existsSync(dotenvPath)
if (exitstsDotenv) {
	console.log('Using .env file to supply config environment variables')
	dotenv.config({ path: dotenvPath })
} else {
	console.log('Using .env.example file to supply config environment variables')
	dotenv.config({ path: dotenvPathExample })
}

const cloudFunctionNames = []
for (const i in process.env) {
	if (i.endsWith('_CLOUD_FUNCTION_NAME')) {
		const name = process.env[i]
		if (cloudFunctionNames.includes(name)) throw new Error('Cloud function names must be unique')
		cloudFunctionNames.push(name)
	}
}

function filterObject(object, keys) {
	const newObject = {}

	for (const i in object) {
		keys.includes(i) && (newObject[i] = `"${object[i]}"`)
	}

	return newObject
}

definePluginConfig = filterObject(process.env, Object.keys(dotenv.parse(fs.readFileSync(exitstsDotenv ? dotenvPath : dotenvPathExample))))
// #endregion

module.exports = {
	entry: './src/index',
	output: {
		filename: 'index.js',
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
		new ForkTsCheckerPlugin(),
		new DefinePlugin(definePluginConfig),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				terserOptions: {
					compress: {},
					output: {
						beautify: true, // TODO: Remove
					},
					keep_classnames: true,
					keep_fnames: true,
				},
				sourceMap: true,
			}),
		],
	},
	node: false,
}