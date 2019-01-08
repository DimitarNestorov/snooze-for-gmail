import { UIRouter, UIView, UISref, pushStateLocationPlugin, ReactStateDeclaration } from '@uirouter/react'
import * as React from 'react'
import { render } from 'react-dom'

import Home from './Home'
import Privacy from './Privacy'
import Terms from './Terms'

const style = document.createElement('style')
style.innerHTML = `
.menu {
	display: flex;
	align-items: center;
}

.menu > a {
	margin: 8px;
}

.menu > a > img {
	margin: 8px;
}

.home {
	display: flex;
	align-items: center;
}

.grow {
	flex-grow: 1;
}

.page {
	margin: 0 auto;
	max-width: 750px;
}
`
document.body.appendChild(style)

const states: ReactStateDeclaration[] = [
	{
		name: 'home',
		url: '/',
		component: Home,
	},
	{
		name: 'privacy',
		url: '/privacy',
		component: Privacy,
	},
	{
		name: 'privacy-html',
		url: '/privacy.html',
		redirectTo: 'privacy',
	},
	{
		name: 'terms',
		url: '/terms',
		component: Terms,
	},
	{
		name: 'terms-html',
		url: '/terms.html',
		redirectTo: 'terms',
	},
]

render(
	<UIRouter plugins={[pushStateLocationPlugin]} states={states}>
		<div>
			<div className="menu">
				<UISref to="home"><a className="home"><img src="/logo.svg" width="32" height="32" />Home</a></UISref>
				<div className="grow" />
				<UISref to="privacy"><a>Privacy Policy</a></UISref>
				<UISref to="terms"><a>Terms of Service</a></UISref>
			</div>

			<div className="page">
				<UIView />
			</div>
		</div>
	</UIRouter>,
	document.getElementById('container'),
)
