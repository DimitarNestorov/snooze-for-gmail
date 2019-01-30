import { google } from 'googleapis'

import {} from 'shared'

export type OAuth2Client = ReturnType<typeof createOAuth2Client>

export function createOAuth2Client() {
	return new google.auth.OAuth2(
		OAUTH_CLIENT_ID,
		OAUTH_CLIENT_SECRET,
		`https://${DOMAIN}/${LOGIN_CALLBACK_CLOUD_FUNCTION_NAME}`,
	)
}
