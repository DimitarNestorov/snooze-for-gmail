declare var globalThis: any

globalThis = (function(this: void) {
	return this
}())

declare const process: {
	env: {
		NODE_ENV: string,
	},
}
