// #region CardBuilder
interface CardBuilderConstructor {
	new (): GoogleAppsScript.Card_Service.CardBuilder
}

export const CardBuilder = (function () {
	return CardService.newCardBuilder()
} as unknown as CardBuilderConstructor)
// #endregion

// #region TextButton
export interface TextButtonOptions {
	text: string,
	functionName?: string,
	authorizationUrl?: string,
}

interface TextButtonConstructor {
	new (options: TextButtonOptions): GoogleAppsScript.Card_Service.TextButton
}

export const TextButton = (function ({ text, functionName, authorizationUrl }: TextButtonOptions) {
	const button = CardService.newTextButton()
	button.setText(text)

	if (functionName) {
		const action = new Action()
		action.setFunctionName(functionName)
		button.setOnClickAction(action)
	} else if (authorizationUrl) {
		const action = new AuthorizationAction()
		action.setAuthorizationUrl(authorizationUrl)
		button.setAuthorizationAction(action)
	}

	return button
} as unknown as TextButtonConstructor)
// #endregion

// #region Action
interface ActionConstructor {
	new (): GoogleAppsScript.Card_Service.Action
}

export const Action = (function () {
	return CardService.newAction()
} as unknown as ActionConstructor)
// #endregion

// #region AuthorizationAction
interface AuthorizationActionConstructor {
	new (): GoogleAppsScript.Card_Service.AuthorizationAction
}

export const AuthorizationAction = (function () {
	return CardService.newAuthorizationAction()
} as unknown as AuthorizationActionConstructor)
// #endregion

// #region ButtonSet
interface ButtonSetConstructor {
	new (...buttons: TextButtonOptions[]): GoogleAppsScript.Card_Service.ButtonSet
}

export const ButtonSet = (function (...buttons: TextButtonOptions[]) {
	const buttonSet = CardService.newButtonSet()
	buttons.map(options => new TextButton(options)).forEach((button) => {
		buttonSet.addButton(button)
	})
	return buttonSet
} as unknown as ButtonSetConstructor)
// #endregion

// #region CardHeader
interface CardHeaderConstructor {
	new (): GoogleAppsScript.Card_Service.CardHeader
}

export const CardHeader = (function () {
	return CardService.newCardHeader()
} as unknown as CardHeaderConstructor)
// #endregion

// #region CardSection
interface CardSectionConstructor {
	new (): GoogleAppsScript.Card_Service.CardSection
}

export const CardSection = (function () {
	return CardService.newCardSection()
} as unknown as CardSectionConstructor)
// #endregion

// #region TextParagraph
interface TextParagraphConstructor {
	new (): GoogleAppsScript.Card_Service.TextParagraph
}

export const TextParagraph = (function () {
	return CardService.newTextParagraph()
} as unknown as TextParagraphConstructor)
// #endregion

// #region Navigation
interface NavigationConstructor {
	new (): GoogleAppsScript.Card_Service.Navigation
}

export const Navigation = (function () {
	return CardService.newNavigation()
} as unknown as NavigationConstructor)
// #endregion

// #region ActionResponseBuilder
interface ActionResponseBuilderConstructor {
	new (): GoogleAppsScript.Card_Service.ActionResponseBuilder
}

export const ActionResponseBuilder = (function () {
	return CardService.newActionResponseBuilder()
} as unknown as ActionResponseBuilderConstructor)
// #endregion

// #region UniversalActionResponseBuilder
interface UniversalActionResponseBuilderConstructor {
	new (): GoogleAppsScript.Card_Service.UniversalActionResponseBuilder
}

export const UniversalActionResponseBuilder = (function () {
	return CardService.newUniversalActionResponseBuilder()
} as unknown as UniversalActionResponseBuilderConstructor)
// #endregion

// #region SelectionInput
interface SelectionInputConstructor {
	new (): GoogleAppsScript.Card_Service.SelectionInput
}

export const SelectionInput = (function () {
	return CardService.newSelectionInput()
} as unknown as SelectionInputConstructor)
// #endregion

// #region Notification
interface NotificationConstructor {
	new (): GoogleAppsScript.Card_Service.Notification
}

export const Notification = (function () {
	return CardService.newNotification()
} as unknown as NotificationConstructor)
// #endregion
