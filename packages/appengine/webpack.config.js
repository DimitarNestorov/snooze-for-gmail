const fs = require('fs')
const path = require('path')

const externals = {}
Object.keys(require('./package.json').dependencies).forEach(key => {
	externals[key] = `commonjs ${key}`
})
delete externals['lodash-es']

const keyJsonPath = path.join(__dirname, 'key.json')
if (!fs.existsSync(keyJsonPath)) {
	console.warn('No key.json, creating an empty one')
	fs.writeFileSync(keyJsonPath, '{}')
}

module.exports = {
	...require('../../webpack.config.js'),
	externals,
}