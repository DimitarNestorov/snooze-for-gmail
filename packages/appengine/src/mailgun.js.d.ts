declare module 'mailgun.js' {
	interface Data {
		from: string,
		to: string[],
		subject: string,
		text?: string,
		html?: string,
	}

	interface MailgunClient {
		messages: {
			create(domain: string, data: Data): Promise<{}>,
		}
	}

	interface MailgunClientOptions {
		username: string,
		key: string,
		public_key?: string,
	}

	export function client(options: MailgunClientOptions): MailgunClient
}
