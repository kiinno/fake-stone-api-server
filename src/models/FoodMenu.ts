import { Schema, model } from 'mongoose';
import { setStringImageURL, onDeleteDocumentDeleteImages, getStringImageURL } from '../utils/modelFeatures';

export interface IFoodItem {
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
	discount?: number;
}

const schema = new Schema<IFoodItem>(
	{
		title: { type: String, required: true },
		category: { type: String, required: true },
		price: { type: Number, required: true },
		discount: { type: Number, default: 0 },
		image: {
			type: String,
			required: true,
			get: getStringImageURL,
			set: setStringImageURL,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// Mongoose Middleware
schema.post<IFoodItem>(/delete/i, onDeleteDocumentDeleteImages<IFoodItem>(['image']));

export default model<IFoodItem>('FoodMenu', schema);
