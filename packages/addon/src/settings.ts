import getDefaults from './defaults'
import { getDaysDropdown, getSettingsFromDropdown, getFolderDropdown } from './dropdowns'
import {
	CardBuilder,
	CardHeader,
	CardSection,
	Notification,
	Navigation,
	ActionResponseBuilder,
	UniversalActionResponseBuilder,
	TextButton,
	ButtonSet,
} from './framework'
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

function createHandler(action: (event: SubmitEvent) => any, message: string) {
	return (event: SubmitEvent) => {
		action(event)

		const notification = new Notification()
		notification.setText(message)

		return new ActionResponseBuilder()
			.setNavigation(new Navigation().popCard())
			.setNotification(notification)
			.build()
	}
}

export const handleSaveClick = createHandler(saveDefaultValues, `Settings saved. ${changesMessage}`)

export const handleResetClick = createHandler(resetDefaultValues, `Settings reset. ${changesMessage}`)

export const handleClearAddon = process.env.NODE_ENV !== 'production' && createHandler(
	() => { userProperties.deleteAllProperties() },
	'User properties deleted.',
)

export function settings() {
	const card = new CardBuilder()
	card.setHeader(new CardHeader().setTitle('Settings'))

	const defaults = getDefaults()

	const buttonSet = new ButtonSet(
		{ text: 'Save', functionName: 'handleSaveClick' },
		{ text: 'Reset', functionName: 'handleResetClick' },
	)

	if (process.env.NODE_ENV !== 'production') {
		const clearButton = new TextButton({ text: 'Clear', functionName: 'handleClearAddon' })
		buttonSet.addButton(clearButton)
	}

	card.addSection(
		new CardSection()
			.addWidget(getDaysDropdown('Default "Snooze for" option', defaults.days))
			.addWidget(getSettingsFromDropdown(defaults.from))
			.addWidget(getFolderDropdown('Default "Move emails to" option', defaults.folder))
			.addWidget(buttonSet),
	)

	return new UniversalActionResponseBuilder().displayAddOnCards([card.build()]).build()
}
