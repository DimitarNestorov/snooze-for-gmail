declare global {
	const REGISTER_CLOUD_FUNCTION_NAME: string
	const LOGIN_CLOUD_FUNCTION_NAME: string
	const LOGIN_CALLBACK_CLOUD_FUNCTION_NAME: string
	const GENERATE_TOKEN_CLOUD_FUNCTION_NAME: string
	const CREATE_FILTER_CLOUD_FUNCTION_NAME: string

	const OAUTH_CLIENT_ID: string
	const OAUTH_CLIENT_SECRET: string

	const CRON_JOB_APPENGINE_PATH: string

	const PROJECT_NAME: string
	const LOCATION: string

	const MAILGUN_API_KEY: string

	const DOMAIN: string
}

export {}
