import to from 'await-to-js'
import { AxiosError, AxiosResponse } from 'axios'
import * as express from 'express'
import { Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { google } from 'googleapis'
import { DateTime } from 'luxon'

import { StatusCodes } from 'shared'
import { createOAuth2Client } from 'shared-node'

const serviceAccount = require('../key.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://snooze-addon.firebaseio.com',
})

const app = express()

async function removeFilter(filterSnapshot: admin.database.DataSnapshot) {
	const { key } = filterSnapshot
	const filter = filterSnapshot.val()

	try {
		const snapshot = await admin.database().ref(`users/${filter.userId}`).once('value')
		const user = snapshot.val()

		const client = createOAuth2Client()
		const gmail = google.gmail({
			version: 'v1',
			auth: client,
		})
		client.setCredentials({
			access_token: user.accessToken,
			refresh_token: user.refreshToken,
		})

		const [ error ] = await to<AxiosResponse<void>, AxiosError>(gmail.users.settings.filters.delete({
			userId: filter.userId,
			id: filter.id,
		}))
		if (error && error.response && (error.response.status !== StatusCodes.NOT_FOUND)) {
			console.error(filter.userId, filter.id, error)
			// TODO: Notify user
		} else {
			await admin.database().ref(`filters/${key}`).remove()
		}
	} catch(error) {
		console.error(error)
	}
}

app.get(`/${CRON_JOB_PATH}`, async (request: Request, response: Response) => {
	const now = DateTime.utc()

	try {
		const snapshot = await admin.database().ref('filters').orderByChild('deleteAfter').endAt(now.toMillis()).once('value')
		if (snapshot.hasChildren()) {
			snapshot.forEach((filterSnapshot) => {
				removeFilter(filterSnapshot)
			})
		}

		response.sendStatus(StatusCodes.NO_CONTENT)
	} catch(error) {
		console.error(error)
		response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
	}
})

app.get('/', (request: Request, response: Response) => {
	response.status(StatusCodes.NO_CONTENT).end()
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})

export default app
