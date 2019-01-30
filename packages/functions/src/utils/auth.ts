import * as admin from 'firebase-admin'

import { OAuth2Client } from 'shared-node'

import { User } from './'

const defaultScope = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
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

export async function getUserFromToken(token?: string): Promise<User | void> {
	if (!token) return

	const tokenSnapshot = await admin.database().ref(`tokens/${token}`).once('value')
	if (!tokenSnapshot.exists()) return

	const userId = tokenSnapshot.val()
	const userSnapshot = await admin.database().ref(`users/${userId}`).once('value')
	if (!userSnapshot.exists()) return

	const userData = userSnapshot.val()
	return new User(userId, userData.accessToken, userData.refreshToken)
}
