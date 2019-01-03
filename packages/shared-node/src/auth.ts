import { google } from 'googleapis'

import { buildUrl } from 'shared'

export function createOAuth2Client() {
	return new google.auth.OAuth2(
		OAUTH_CLIENT_ID,
		OAUTH_CLIENT_SECRET,
		buildUrl(LOGIN_CALLBACK_CLOUD_FUNCTION_NAME),
	)
}
