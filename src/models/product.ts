import { Schema, model, Types } from 'mongoose';

export interface IProduct {
	title: string;
	description: string;
	price?: number;
	discount?: number;
	owner?: Types.ObjectId;
	productImage: string;
	thumbnails?: string[];
}

const schema = new Schema<IProduct>(
	{
		title: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		description: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
		},
		price: {
			type: Number,
			min: [0, 'price must be greator than 0'],
			default: 0,
		},
		discount: {
			type: Number,
			min: [0, 'discount must be greator than or equal 0'],
			max: [100, 'discount must be less than or equal 100'],
			default: 0,
		},
		owner: {
			type: Types.ObjectId,
			ref: 'User',
		},
		productImage: {
			type: String,
			trim: true,
			required: true,
		},
		thumbnails: [String],
	},
	{ timestamps: true, versionKey: false }
);
const Product = model<IProduct>('Product', schema);

export default Product;
