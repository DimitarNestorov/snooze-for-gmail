import { buildUrlQueryString } from 'shared'

if (location.pathname === `/${LOGIN_CALLBACK_CLOUD_FUNCTION_NAME}`) {
	location.href = buildUrlQueryString(LOGIN_CALLBACK_CLOUD_FUNCTION_NAME, location.search.substr(1))
} else {
	import('./app')
}
