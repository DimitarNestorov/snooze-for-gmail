export const endpoint = `https://${LOCATION}-${PROJECT_NAME}.cloudfunctions.net`

type Query = { [key: string]: string | number }
export function buildUrl(path: string = '', query: Query = {}): string {
	const search = Object.keys(query).map(key => {
		return `${key}=${query[key]}`
	}).join('&')

	return `${endpoint}/${path}${search ? '?' : ''}${search}`
}
