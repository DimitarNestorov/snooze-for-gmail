import { getTimeDropdown, getFolderDropdown, getFromDropdown } from './dropdowns'
import getDefaults from './defaults'

type GmailEvent = {
	messageMetadata: {
		accessToken: string,
		messageId: string,
	},
};

globalThis.main = function main(event: GmailEvent) {
	const accessToken = event.messageMetadata.accessToken
	GmailApp.setCurrentMessageAccessToken(accessToken)

	const cards: GoogleAppsScript.Card_Service.Card[] = []

	const card = CardService.newCardBuilder()
	card.setHeader(CardService.newCardHeader().setTitle('Snooze'))

	const defaults = getDefaults()
	const button = CardService.newTextButton().setText('Snooze').setOnClickAction(
		CardService.newAction().setFunctionName('handleSnoozeClick')
	)

	const section = CardService.newCardSection()
		.addWidget(getTimeDropdown('Snooze for', defaults.days))
		.addWidget(getFromDropdown(event.messageMetadata.messageId, defaults.from))
		.addWidget(getFolderDropdown('Move emails to', defaults.folder))
		.addWidget(CardService.newButtonSet().addButton(button))

	card.addSection(section)

	cards.push(card.build())

	return cards
}

globalThis.handleSnoozeClick = function handleSnoozeClick() {

}
