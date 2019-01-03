export const enum StatusCodes {
	OK = 200,
	NO_CONTENT = 204,

	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	TOO_MANY_REQUESTS = 429,

	INTERNAL_SERVER_ERROR = 500,
}

export const enum Folder {
	Archive = 'archive',
	Trash = 'trash',
}
