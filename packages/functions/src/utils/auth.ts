import * as functions from 'firebase-functions'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

import { buildUrl } from 'shared/src'

export function createOAuth2Client() {
	return new google.auth.OAuth2(
		functions.config().oauth.client_id,
		functions.config().oauth.client_secret,
		buildUrl('loginCallback'),
	)
}

const defaultScope = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/gmail.settings.basic",
]
export function getConnectionUrl(auth: OAuth2Client, loginHint: string | undefined) {
	return auth.generateAuthUrl({
		access_type: 'offline',
		prompt: 'consent',
		scope: defaultScope,
		login_hint: loginHint,
	})
}