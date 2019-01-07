import { SelectionInput } from './framework'
import { Days, Folder, From } from './types'

function newDropdown(title: string, name: string) {
	return new SelectionInput()
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
const regex = /<([^@]+@[^>]+)>/
function extractEmailAddress(sender: string) {
	const match = regex.exec(sender)
	if (match) return match[1]
	return sender
}

function extractDomain(email: string) {
	return email.replace(/.*@/, '')
}

export function getFromDropdown(messageId: string, defaultValue: From) {
	// Use the Gmail service to access information about this message.
	const mail = GmailApp.getMessageById(messageId)
	const senderEmail = mail.getFrom()

	const justEmail = extractEmailAddress(senderEmail)
	const domain = `*@${extractDomain(justEmail)}`
	return newDropdown('Snooze emails from', 'from')
		.addItem(senderEmail, senderEmail, defaultValue === From.Full)
		.addItem(justEmail, justEmail, defaultValue === From.Email)
		.addItem(domain, domain, defaultValue === From.Domain)
}

export function getSettingsFromDropdown(defaultValue: From) {
	return newDropdown('Default "Snooze emails from" option', 'from')
		.addItem('Name <address@domain.com>', 'full', defaultValue === From.Full)
		.addItem('address@domain.com', 'email', defaultValue === From.Email)
		.addItem('*@domain.com', 'domain', defaultValue === From.Domain)
}

export function getDaysDropdown(title: string, defaultValue: Days) {
	return newDropdown(title, 'days')
		.addItem('24 hours', Days.One, defaultValue === Days.One)
		.addItem('7 days', Days.Seven, defaultValue === Days.Seven)
		.addItem('30 days', Days.Thirty, defaultValue === Days.Thirty)
}

export function getFolderDropdown(title: string, defaultValue: Folder) {
	return newDropdown(title, 'folder')
		.addItem('Archive', Folder.Archive, defaultValue === Folder.Archive)
		.addItem('Trash', Folder.Trash, defaultValue === Folder.Trash)
}
