import { buildUrl, StatusCodes, capitalizeFirstLetter } from 'shared'

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

function createResponse(title: string, body: string): GoogleAppsScript.Card_Service.ActionResponse {
	return CardService.newActionResponseBuilder().setNavigation(
		CardService.newNavigation().updateCard(
			CardService.newCardBuilder().setHeader(
				CardService.newCardHeader().setTitle(title),
			).addSection(
				CardService.newCardSection().addWidget(
					CardService.newTextParagraph().setText(body)
				),
			).build(),
		),
	).build()
}

export function handleSnoozeClick(event: ClickEvent): GoogleAppsScript.Card_Service.ActionResponse {
	const token = userProperties.getProperty('token')
	const { from, days: daysString, folder } = event.formInput
	const days = Number(daysString)
	const url = buildUrl(CREATE_FILTER_CLOUD_FUNCTION_NAME, {
		from: encodeURIComponent(from),
		days,
		folder,
	})

	const escapedFrom = from.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')

	const response = UrlFetchApp.fetch(url, { method: 'post', headers: { Token: token }, muteHttpExceptions: true })
	const responseCode = response.getResponseCode()
	if (responseCode === StatusCodes.BAD_REQUEST) {
		return createResponse(
			'Filter already exists',
			`A filter that moves messages from <b>${escapedFrom}</b> to <b>${capitalizeFirstLetter(folder)}</b> already exists in your settings`,
		)
	} else if (isErrorCode(responseCode)) {
		return createResponse('An error occured', 'Please try again later')
	}

	return createResponse(
		`Snoozed ${escapedFrom}`,
		`You won't see emails from <b>${escapedFrom}</b> in your inbox for <b>${days === 1 ? '24 hours' : `${days} days`}</b>`,
	)
}
