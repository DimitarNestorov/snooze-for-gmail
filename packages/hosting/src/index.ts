import { buildUrlQueryString } from 'shared'

if (location.pathname === `/${LOGIN_CALLBACK_CLOUD_FUNCTION_NAME}`) {
	location.href = buildUrlQueryString(LOGIN_CALLBACK_CLOUD_FUNCTION_NAME, location.search.substr(1))
} else {
	const img = document.createElement('img')
	img.src = '/logo.svg'
	img.width = 100
	img.height = 100
	img.alt = "Logo"
	document.body.appendChild(img)
}
