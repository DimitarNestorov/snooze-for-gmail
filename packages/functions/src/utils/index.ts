import * as functions from 'firebase-functions'

export * from './auth'
export * from './html'
export * from './models'

export function createFunction() {
	return functions.region(LOCATION).https
}
