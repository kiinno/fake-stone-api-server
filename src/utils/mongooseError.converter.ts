export interface IMErrConverted {
	status: string;
	name: string;
	message: string;
	details: string;
	invalidFields: string[];
	formErrors: unknown;
}

export default function (error: any): IMErrConverted | boolean {
	if (typeof error === 'object' && error.name === 'ValidationError') {
		const invalidFieldsKeys = Object.keys(error.errors);
		const formErrors = invalidFieldsKeys.reduce((previos: any, current: string) => {
			previos[current] = error.errors[current].properties;
			return previos;
		}, {});
		return {
			status: 'error',
			name: error.name,
			message: error._message,
			details: error.message,
			invalidFields: invalidFieldsKeys,
			formErrors: formErrors,
		};
	}
	return false;
}
