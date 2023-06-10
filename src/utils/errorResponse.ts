/**
 * Create an Error Response
 * @param message
 * @param statusCode 500
 */
export default class ErrorResponse extends Error {
	status: string;
	constructor(message: string, public statusCode = 500) {
		super(message);
		this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
	}
}
