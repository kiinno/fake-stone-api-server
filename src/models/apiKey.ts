import { Schema, model } from 'mongoose';

export interface IAPIKey {
	key: string;
	expiredAt?: Date;
	blocked?: boolean;
}

const schema = new Schema<IAPIKey>(
	{
		key: {
			type: String,
			trim: true,
			required: true,
		},
		blocked: Boolean,
		expiredAt: Date,
	},
	{ timestamps: true, versionKey: false }
);
const APIKey = model<IAPIKey>('APIKey', schema);

export default APIKey;
