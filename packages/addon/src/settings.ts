import getDefaults from './defaults'
import { getDaysDropdown, getSettingsFromDropdown, getFolderDropdown } from './dropdowns'
import { userProperties } from './properties'

type SubmitEvent = {
	formInput: {
		days: string,
		from: string,
		folder: string,
	},
}

function saveDefaultValues(event: SubmitEvent) {
	userProperties.setProperty('defaults', JSON.stringify({
		days: parseInt(event.formInput.days, 10),
		from: event.formInput.from,
		folder: event.formInput.folder,
	}))
}

function resetDefaultValues() {
	userProperties.deleteProperty('defaults')
}

const changesMessage = 'Changes will be applied next time the add-on loads.'

export function handleSaveClick(event: SubmitEvent) {
	saveDefaultValues(event)
	return CardService.newActionResponseBuilder()
		.setNavigation(CardService.newNavigation().popCard())
		.setNotification(
			CardService.newNotification()
				.setText(`Settings saved. ${changesMessage}`)
				.setType(CardService.NotificationType.INFO),
		)
		.build()
}

export function handleResetClick() {
	resetDefaultValues()
	return CardService.newActionResponseBuilder()
		.setNavigation(CardService.newNavigation().popCard())
		.setNotification(
			CardService.newNotification()
				.setText(`Settings reset. ${changesMessage}`)
				.setType(CardService.NotificationType.INFO),
		)
		.build()
}

export function settings() {
	const card = CardService.newCardBuilder()
	card.setHeader(CardService.newCardHeader().setTitle('Settings'))

	const defaults = getDefaults()

	card.addSection(
		CardService.newCardSection()
			.addWidget(getDaysDropdown('Default "Snooze for" option', defaults.days))
			.addWidget(getSettingsFromDropdown(defaults.from))
			.addWidget(getFolderDropdown('Default "Move emails to" option', defaults.folder))
			.addWidget(
				CardService.newButtonSet().addButton(
					CardService.newTextButton()
						.setText('Save')
						.setOnClickAction(CardService.newAction().setFunctionName('handleSaveClick')),
				).addButton(
					CardService.newTextButton()
						.setText('Reset')
						.setOnClickAction(CardService.newAction().setFunctionName('handleResetClick')),
				),
			),
	)

	return CardService.newUniversalActionResponseBuilder().displayAddOnCards([card.build()]).build()
}
