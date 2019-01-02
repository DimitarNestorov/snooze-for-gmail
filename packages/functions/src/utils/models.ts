import * as admin from 'firebase-admin'

export class User {
	constructor(
		public readonly id: string,
		public accessToken: string,
		public refreshToken: string,
	) {
	}

	save() {
		return admin.database().ref(`users/${this.id}`).update({
			accessToken: this.accessToken,
			refreshToken: this.refreshToken,
		})
	}
}
