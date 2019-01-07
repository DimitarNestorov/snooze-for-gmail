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
	const a = document.createElement('a')
	a.href = './privacy.html'
	a.innerText = 'Privacy Policy'
	const div = document.createElement('div')
	div.appendChild(a)
	document.body.appendChild(div)
}
