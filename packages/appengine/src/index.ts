import to from 'await-to-js'
import * as express from 'express'
import { Request, Response } from 'express'
import * as admin from 'firebase-admin'
import { GaxiosError, GaxiosResponse } from 'gaxios'
import { google } from 'googleapis'
import { debounce } from 'lodash-es'
import { DateTime } from 'luxon'
import * as mailgun from 'mailgun.js'

import { StatusCodes, Folder } from 'shared'
import { createOAuth2Client } from 'shared-node'

const serviceAccount = require('../key.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: `https://${PROJECT_NAME}.firebaseio.com`,
})

const mg = mailgun.client({
	username: 'api',
	key: MAILGUN_API_KEY,
})

const app = express()

type User = {
	givenName: string,
	name: string,
	email: string,
}

type Filter = {
	userId: string,
	from: string,
	folder: string,
	key: string,
}

const filterToString = ({ from, folder }: Filter) => `
Matches: from:(${from.replace("@", "(at)").replace(/\./g, "(dot)")})
Do this: ${
	folder === Folder.Trash
		? 'Mark as read, Delete it'
		: 'Skip Inbox, Mark as read'
}`

function generateMessage(name: string, filtersString: string) {
	return `Hey ${name},

It seems like we weren't able to remove some filters from your settings. Under the hood Snooze for Gmail creates filters in your settings. Those filters are the magic that prevents emails from reaching your inbox. After the specified amount of time they get removed. However the following filters weren't removed:
${filtersString}

To remove those filters, just head to Gmail settings, then click on "Filters and Blocked Addresses", and hit delete on each of the filters.

We would like to apologize for the inconvenience.

Snooze for Gmail`
}

async function notifyUser(userId: string, filters: Filter[]) {
	try {
		const userSnapshot = await admin.database().ref(`users/${userId}`).once('value')
		if (!userSnapshot.exists()) return
		const user: User = userSnapshot.val()

		const filtersString = filters.map(filterToString).join('\n')

		await mg.messages.create(`mg.${DOMAIN}`, {
			from: `Snooze for Gmail <support@${DOMAIN}>`,
			to: [user.email],
			subject: 'Some filters were not removed!',
			text: generateMessage(user.givenName || user.name, filtersString)
		})

		filters.forEach(async filter => {
			const [ error ] = await to(admin.database().ref(`notifyRemoveFailed/${filter.key}`).remove())
			error && console.error(filter.key, error)
		})
	} catch(error) {
		console.error(error)
	}
}

const queueNotifyUsers = debounce(async () => {
	try {
		const snapshot = await admin.database().ref('notifyRemoveFailed').orderByChild('userId').once('value')
		if (snapshot.hasChildren()) {
			const sortedFilters: { [userId: string]: Filter[] } = {}
			let lastUserId: string | undefined
			snapshot.forEach((filterSnapshot) => {
				const filter = filterSnapshot.val()
				filter.key = filterSnapshot.key
				if (filter.userId !== lastUserId) {
					lastUserId = filter.userId
					sortedFilters[lastUserId!] = []
				}

				sortedFilters[lastUserId!].push(filter)
			})

			Object.keys(sortedFilters).forEach((userId) => {
				const filters = sortedFilters[userId]
				notifyUser(userId, filters)
			})
		}
	} catch (error) {
		console.error(error)
	}
}, 300000, { trailing: true })

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

		const [ error ] = await to<GaxiosResponse<void>, GaxiosError>(gmail.users.settings.filters.delete({
			userId: filter.userId,
			id: filter.id,
		}))
		if (error && error.response && (error.response.status !== StatusCodes.NOT_FOUND)) {
			console.error(filter.userId, filter.id, error)
			await admin.database().ref(`notifyRemoveFailed/${filterSnapshot.key}`).set(filter)
			await filterSnapshot.ref.remove()
			queueNotifyUsers()
		} else {
			await admin.database().ref(`filters/${key}`).remove()
		}
	} catch(error) {
		console.error(error)
	}
}

app.get(`/${CRON_JOB_APPENGINE_PATH}`, async (request: Request, response: Response) => {
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
	response.sendStatus(StatusCodes.NO_CONTENT)
})

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})

export default app
