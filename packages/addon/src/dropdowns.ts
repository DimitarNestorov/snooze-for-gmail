import { Days, Folder, From } from './types'

function newDropdown(title: string, name: string) {
	return CardService.newSelectionInput()
		.setType(CardService.SelectionInputType.DROPDOWN)
		.setTitle(title)
		.setFieldName(name)
}

/**
 *  Given the result of GmailMessage.getFrom(), extract only the email address.
 *  getFrom() can return just the email address or a string in the form
 *  "Name <myemail@domain>".
 *
 *  @param {String} sender The results returned from getFrom().
 *  @return {String} Only the email address.
 */
function extractEmailAddress(sender: string) {
	var regex = /<([^@]+@[^>]+)>/
	var email = sender // Default to using the whole string.
	var match = regex.exec(sender)
	if (match) {
		email = match[1]
	}
	return email
}

function extractDomain(email: string) {
	return email.replace(/.*@/, '')
}

export function getFromDropdown(messageId: string, defaultValue: From) {
	// Use the Gmail service to access information about this message.
	var mail = GmailApp.getMessageById(messageId)
	var senderEmail = mail.getFrom()

	var justEmail = extractEmailAddress(senderEmail)
	var domain = '*@' + extractDomain(justEmail)
	return newDropdown('Snooze emails from', 'from')
		.addItem(senderEmail, senderEmail, defaultValue === From.Full)
		.addItem(justEmail, justEmail, defaultValue === From.Email)
		.addItem(domain, domain, defaultValue === From.Domain)
}

export function getTimeDropdown(title: string, defaultValue: Days) {
	return newDropdown(title, 'time')
		.addItem('24 hours', Days.One, defaultValue === Days.One)
		.addItem('7 days', Days.Seven, defaultValue === Days.Seven)
		.addItem('30 days', Days.Thirty, defaultValue === Days.Thirty)
}

export function getFolderDropdown(title: string, defaultValue: Folder) {
	return newDropdown(title, 'folder')
		.addItem('Archive', Folder.Archive, defaultValue === Folder.Archive)
		.addItem('Trash', Folder.Trash, defaultValue === Folder.Trash)
}
