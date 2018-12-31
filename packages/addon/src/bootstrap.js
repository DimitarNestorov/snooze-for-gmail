function define(name, deps, module) {
	if (!this.modules) this.modules = {}
	var modules = this.modules

	modules[name] = module
	module.deps = deps

	if (name === "index") bootstrap()
}

function bootstrap() {
	var global = this

	if (global.isExecuted) return
	global.isExecuted = true

	global.global = global

	const modules = global.modules

	function require(name) {
		return runModule(modules[name])
	}

	function runModule(module) {
		if (module.exports) return module.exports

		var exports = {}
		module.exports = exports

		var deps = module.deps.slice(2).map(require)
		deps.unshift(require, exports)

		module.apply(null, deps)

		return exports
	}

	require("index")
}
