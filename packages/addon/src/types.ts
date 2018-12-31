export const enum Folder {
	Archive = 'archive',
	Trash = 'trash',
}

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

export type Defaults = {
	from: From,
	days: Days,
	folder: Folder,
}
