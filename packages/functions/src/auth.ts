import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { google } from 'googleapis'

import { StatusCodes } from 'shared'
import { createOAuth2Client } from 'shared-node'

import {
	getConnectionUrl,
	errorOccurredMarkup,
	createFunction,
	redirectingMarkup,
} from './utils'


function redirectToLogin(email: string, response: functions.Response) {
	const client = createOAuth2Client()
	response.redirect(getConnectionUrl(client, email))
}

exports[LOGIN_CALLBACK_CLOUD_FUNCTION_NAME] = createFunction().onRequest(async (request, response) => {
	try {
		const { code }: { code?: string } = request.query
		if (!code) throw new Error('Code is empty')

		const client = createOAuth2Client()
		const { tokens } = await client.getToken(code)
		client.setCredentials(tokens)

		const oauth2 = google.oauth2({
			version: 'v2',
			auth: client,
		})
		const { data } = await oauth2.userinfo.v2.me.get()
		const { id } = data
		if (!id) throw new Error('ID is undefined')

		await admin.database().ref(`users/${id}`).update({
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
		})

		response.send(redirectingMarkup)
	} catch (error) {
		console.error(error)
		response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorOccurredMarkup).end()
	}
})

exports[LOGIN_CLOUD_FUNCTION_NAME] = createFunction().onRequest(async (request, response) => {
	const { accessToken }: { accessToken: string } = request.query

	const oauth2Client = new google.auth.OAuth2()

	const oauth2 = google.oauth2({
		version: 'v2',
		auth: oauth2Client,
	})

	oauth2Client.setCredentials({ access_token: accessToken })

	try {
		const { data } = await oauth2.userinfo.v2.me.get()
		const { email, id, name, given_name } = data

		if (!email) throw new Error('Email is empty')

		const path = `users/${id}`
		const userSnapshot = await admin.database().ref(path).once('value')

		if (!userSnapshot.exists()) {
			await admin.database().ref(path).set({ email, name, givenName: given_name })
			redirectToLogin(email, response)

			return
		}

		redirectToLogin(email, response)
	} catch (error) {
		console.error(error)
		response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorOccurredMarkup).end()
	}
})

exports[GENERATE_TOKEN_CLOUD_FUNCTION_NAME] = createFunction().onRequest(async (request, response) => {
	const { accessToken }: { accessToken: string } = request.query

	const oauth2Client = new google.auth.OAuth2()

	const oauth2 = google.oauth2({
		version: 'v2',
		auth: oauth2Client,
	})

	oauth2Client.setCredentials({ access_token: accessToken })

	try {
		const { data } = await oauth2.userinfo.v2.me.get()
		const { id } = data

		if (!id) throw new Error('id is undefined')

		const snapshot = await admin.database().ref(`users/${id}`).once('value')
		if (!snapshot.exists()) {
			// User does not exist
			response.status(401).end()
			return
		}

		const token = await admin.database().ref('tokens').push(id)
		response.json({ token: token.key }).end()
	} catch(error) {
		console.error(error)
		response.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
	}
})
