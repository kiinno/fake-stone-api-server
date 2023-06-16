import { Schema, model } from 'mongoose';

export interface IDateReminder {
	name: string;
	date: Date;
	avatar: string;
	description?: string;
}

const schema = new Schema<IDateReminder>({
	name: { type: String, required: true },
	date: { type: Date, required: true },
	avatar: {
		type: String,
		required: true,
	},
	description: String,
});

export default model<IDateReminder>('DatesReminder', schema);
