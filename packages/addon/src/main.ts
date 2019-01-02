import { buildUrl } from 'shared'

import getDefaults from './defaults'
import { getDaysDropdown, getFolderDropdown, getFromDropdown } from './dropdowns'
import { isErrorCode } from './functions'
import { userProperties } from './properties'
import { Combined } from './types'

type GmailEvent = {
	messageMetadata: {
		accessToken: string,
		messageId: string,
	},
}

function login(accessToken: string) {
	const loginCard = CardService.newCardBuilder()
	loginCard.setHeader(CardService.newCardHeader().setTitle('Login'))

	const loginSection = CardService.newCardSection()
		.addWidget(
			CardService.newButtonSet()
				.addButton(
					CardService.newTextButton()
						.setText('Login')
						.setAuthorizationAction(
							CardService.newAuthorizationAction()
								.setAuthorizationUrl(buildUrl(LOGIN_CLOUD_FUNCTION_NAME, { accessToken })),
						),
				),
		)

	loginCard.addSection(loginSection)
	return [loginCard.build()]
}

export function main(event: GmailEvent): GoogleAppsScript.Card_Service.Card[] {
	const token = userProperties.getProperty('token')
	if (!token) {
		const accessToken = ScriptApp.getOAuthToken()
		const url = buildUrl(GENERATE_TOKEN_CLOUD_FUNCTION_NAME, { accessToken })
		const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true })
		if (isErrorCode(response.getResponseCode())) return login(accessToken)

		Logger.log(response.getContentText())
		const tokenFromResponse = JSON.parse(response.getContentText()).token
		userProperties.setProperty('token', tokenFromResponse)
		// token = tokenFromResponse
	}

	const accessToken = event.messageMetadata.accessToken
	GmailApp.setCurrentMessageAccessToken(accessToken)

	const cards: GoogleAppsScript.Card_Service.Card[] = []

	const card = CardService.newCardBuilder()
	card.setHeader(CardService.newCardHeader())

	const defaults = getDefaults()
	const button = CardService.newTextButton().setText('Snooze').setOnClickAction(
		CardService.newAction().setFunctionName('handleSnoozeClick')
	)

	const section = CardService.newCardSection()
		.addWidget(getDaysDropdown('Snooze for', defaults.days))
		.addWidget(getFromDropdown(event.messageMetadata.messageId, defaults.from))
		.addWidget(getFolderDropdown('Move emails to', defaults.folder))
		.addWidget(CardService.newButtonSet().addButton(button))

	card.addSection(section)

	cards.push(card.build())

	return cards
}

type ClickEvent = {
	formInput: Combined,
}

export function handleSnoozeClick(event: ClickEvent) {
	const token = userProperties.getProperty('token')
	const url = buildUrl(CREATE_FILTER_CLOUD_FUNCTION_NAME, {
		from: encodeURIComponent(event.formInput.from),
		days: event.formInput.days,
		folder: event.formInput.folder,
	})

	UrlFetchApp.fetch(url, { method: 'post', headers: { Token: token } })
	return CardService.newActionResponseBuilder().setNavigation(
		CardService.newNavigation().updateCard(
			CardService.newCardBuilder().setHeader(
				CardService.newCardHeader().setTitle('Complete'),
			).build(),
		),
	).build()
}
