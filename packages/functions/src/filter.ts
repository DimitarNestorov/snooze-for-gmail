import to from 'await-to-js'
import * as admin from 'firebase-admin'
import { google, gmail_v1 } from 'googleapis'
import { DateTime } from 'luxon'

import { StatusCodes, Folder } from 'shared'

import { createFunction, getUserFromToken, createOAuth2Client } from './utils'

exports[CREATE_FILTER_CLOUD_FUNCTION_NAME] = createFunction().onRequest(async (request, response) => {
	const [ error, user ] = await to(getUserFromToken(request.headers.token as string))
	if (!user || error) {
		error && console.error(error)
		response.sendStatus(StatusCodes.UNAUTHORIZED)
		return
	}

	const { days, from, folder } = request.query

	const oauth2Client = createOAuth2Client()

	const gmail = google.gmail({
		version: 'v1',
		auth: oauth2Client,
	})

	oauth2Client.setCredentials({
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

	// TODO: Check if filter exists
	try {
		const { data: filter } = await gmail.users.settings.filters.create({
			userId: 'me',
			requestBody: { criteria, action },
		})

		response.sendStatus(StatusCodes.OK)

		if (oauth2Client.credentials.id_token) {
			user.accessToken = oauth2Client.credentials.access_token!
			const [ error ] = await to(user.save())
			error && console.error(error)
		}

		const deleteAfter = DateTime.local().plus({ days: parseInt(days, 10) })

		const [ error ] = await to(admin.database().ref('filters').push({
			deleteAfter: deleteAfter.toISO(),
			userId: user.id,
			googleId: filter.id,
		}))
		error && console.error(error)
	} catch(error) {
		console.error('Create filter:', error, user)
		response.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
	}
})
