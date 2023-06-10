import { Schema, Types, model } from 'mongoose';
import { getListStringImageURL, onDeleteDocumentDeleteImages, setListStringImageURL } from '../utils/modelFeatures';

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
		images: {
			type: [String],
			get: getListStringImageURL,
			set: setListStringImageURL,
		},
		likers: {
			type: [Types.ObjectId],
			required: true,
			ref: 'User',
		},
	},
	{ timestamps: true, versionKey: false }
);

// Mongoose Middleware
schema.post<IPOST>(/delete/i, onDeleteDocumentDeleteImages<IPOST>(['images']));

const Post = model<IPOST>('Post', schema);

export default Post;
