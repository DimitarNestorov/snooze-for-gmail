import { Folder } from 'shared'

export { Folder } from 'shared'

export const enum From {
	Domain = 'domain',
	Email = 'email',
	Full = 'full',
}

export const enum Days {
	One = 1,
	Seven = 7,
	Thirty = 30,
}

export type Combined = {
	from: From,
	days: Days,
	folder: Folder,
}
