const fs = require('fs')
const path = require('path')

const dotenv = require('dotenv')

const dotenvPath = path.join(__dirname, '.env')
const dotenvPathExample = path.join(__dirname, '.env.example')
if (fs.existsSync(dotenvPath)) {
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
		keys.includes(i) && (newObject[i] = object[i])
	}

	return newObject
}

module.exports = filterObject(process.env, [
	'LOGIN_CLOUD_FUNCTION_NAME',
	'LOGIN_CALLBACK_CLOUD_FUNCTION_NAME',
	'GENERATE_TOKEN_CLOUD_FUNCTION_NAME',
	'CREATE_FILTER_CLOUD_FUNCTION_NAME',
])
