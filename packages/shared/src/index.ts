export const endpoint = 'https://us-central1-snooze-addon.cloudfunctions.net'

type Query = { [key: string]: string | number }
export function buildUrl(path: string = '', query: Query = {}): string {
	const search = Object.keys(query).map(key => {
		return `${key}=${query[key]}`
	}).join('&')

	return `${endpoint}/${path}${search ? '?' : ''}${search}`
}

export const enum StatusCodes {
	OK = 200,

	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,

	INTERNAL_SERVER_ERROR = 500,
}

export const enum Folder {
	Archive = 'archive',
	Trash = 'trash',
}

export * from './env'
