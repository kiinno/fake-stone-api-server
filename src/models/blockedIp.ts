import { Schema, model } from 'mongoose';

export interface IBlockedIP {
	ip: string;
	banned?: {
		forever?: boolean;
		to?: Date;
	};
	comment?: string;
}

const schema = new Schema<IBlockedIP>(
	{
		ip: {
			type: String,
			required: true,
		},
		comment: String,
		banned: {
			forever: Boolean,
			to: Date,
		},
	},
	{ timestamps: true, versionKey: false }
);
const Banned = model<IBlockedIP>('BlockedIP', schema);

export default Banned;
