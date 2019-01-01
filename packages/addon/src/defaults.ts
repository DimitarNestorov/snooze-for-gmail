import { Defaults, From, Days, Folder } from './types'
import { userProperties } from './properties'


function getDefaultsFromStorage() {
	try {
		return JSON.parse(userProperties.getProperty('defaults') || "{}")
	} catch(error) {
		return {}
	}
}

export default function getDefaults(): Defaults {
	const defaultsFromStorage = getDefaultsFromStorage()
	const from = typeof defaultsFromStorage.from === 'string'
		? defaultsFromStorage.from as From
		: From.Full
	const days = typeof defaultsFromStorage.days === 'number'
		? defaultsFromStorage.days as Days
		: Days.Seven
	const folder = typeof defaultsFromStorage.folder === 'string'
		? defaultsFromStorage.folder as Folder
		: Folder.Archive

	return {
		from,
		days,
		folder
	}
}
