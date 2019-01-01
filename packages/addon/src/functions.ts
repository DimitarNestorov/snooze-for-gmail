import { StatusCodes } from 'shared'

export function isErrorCode(code: number) {
	return code > StatusCodes.BAD_REQUEST
}
