const externals = {}
Object.keys(require('./package.json').dependencies).forEach(key => {
	externals[key] = `commonjs ${key}`
})
delete externals['lodash-es']

module.exports = {
	...require('../../webpack.config.js'),
	externals,
}