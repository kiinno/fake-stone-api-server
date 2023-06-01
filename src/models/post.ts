import { Schema, Types, model } from 'mongoose';

export interface IPOST {
	caption: string;
	likers: Types.ObjectId[];
	images?: string[];
	user?: Types.ObjectId;
}

const schema = new Schema<IPOST>(
	{
		caption: {
			type: String,
			required: true,
		},
		user: {
			type: Types.ObjectId,
			ref: 'User',
		},
		images: [String],
		likers: {
			type: [Types.ObjectId],
			required: true,
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);
const Post = model<IPOST>('Post', schema);

export default Post;
