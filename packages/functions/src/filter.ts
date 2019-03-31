import to from 'await-to-js'
import * as admin from 'firebase-admin'
import { GaxiosError } from 'gaxios'
import { google, gmail_v1 } from 'googleapis'
import { DateTime } from 'luxon'

import { StatusCodes, Folder, logError } from 'shared'
import { createOAuth2Client } from 'shared-node'

import { createFunction, getUserFromToken } from './utils'

function isFilterAlreadyExistsError(error: any): boolean {
	if (typeof error !== "object") return false
	if (!(error instanceof GaxiosError)) return false
	if (!error.response) return false
	if (error.response.status !== StatusCodes.BAD_REQUEST) return false

	return error.response.statusText.includes('Filter already exists')
}

exports[CREATE_FILTER_CLOUD_FUNCTION_NAME] = createFunction().onRequest(async (request, response) => {
	const [ error, user ] = await to(getUserFromToken(request.headers.token as string))
	if (!user || error) {
		error && console.error(error)
		response.sendStatus(StatusCodes.UNAUTHORIZED)
		return
	}

	const { days, from, folder } = request.query

	const client = createOAuth2Client()

	const gmail = google.gmail({
		version: 'v1',
		auth: client,
	})

	client.setCredentials({
		access_token: user.accessToken,
		refresh_token: user.refreshToken,
	})

	const criteria = { from }

	const action: gmail_v1.Schema$FilterAction = { removeLabelIds: ['UNREAD'] }

	if (folder === Folder.Trash) {
		action.addLabelIds = ['TRASH']
	} else { // Folder.Archive
		action.removeLabelIds!.push('INBOX')
	}

	try {
		const { data: filter } = await gmail.users.settings.filters.create({
			userId: 'me',
			requestBody: { criteria, action },
		})

		response.sendStatus(StatusCodes.OK)

		if (client.credentials.id_token) {
			user.accessToken = client.credentials.access_token!
			user.save().catch(logError)
		}

		const deleteAfter = DateTime.utc().plus({ days: parseInt(days, 10) }).toMillis()

		const entry = {
			deleteAfter,
			userId: user.id,
			id: filter.id,
			from,
			folder,
		}

		const [ error ] = await to(admin.database().ref('filters').push(entry))
		error && console.error(entry, error)
	} catch(error) {
		if (isFilterAlreadyExistsError(error)) {
			response.sendStatus(StatusCodes.BAD_REQUEST)
			return
		}

		console.error('Create filter:', error, user)
		response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
	}
})
