function define(name, dependencies, module) {
	this.modules = this.modules || {}
	if (modules[name]) throw new Error("Module '" + name + "' already defined")
	modules[name] = module
	module.dependencies = dependencies
}

function require(name) {
	if (!modules[name]) throw new Error("Module '" + name + "' is not defined")
	return runModule(modules[name])
}

function runModule(module) {
	if (module === "require") return require
	if (module === "exports") return {}
	if (module.exports) return module.exports

	var exports = {}
	module.exports = exports

	var dependencies = module.dependencies.slice(2).map(require)
	dependencies.unshift(require, exports)

	module.apply(null, dependencies)

	return exports
}

globalThis = this
require("index")
