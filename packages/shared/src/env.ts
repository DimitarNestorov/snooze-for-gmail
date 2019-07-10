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
	const LOCATION: "us-central1" | "us-east1" | "us-east4" | "europe-west1" | "europe-west2" | "asia-east2" | "asia-northeast1"

	const MAILGUN_API_KEY: string

	const DOMAIN: string
}

export {}
