export * from './buildUrl'
export * from './enums'
export * from './env'

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
