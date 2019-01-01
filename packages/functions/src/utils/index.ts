import * as functions from 'firebase-functions'

export * from './auth'
export * from './html'

export function createFunction() {
	return functions.region('us-central1').https
}
