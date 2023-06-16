import { Router } from 'express';
import ApplyRoute from '../utils/applyRoute';
import authRoute from './auth';

// Users
import User, { IUSER } from '../models/user';
import userGenerator from '../utils/generators/user.generator';

// Products
import Product, { IProduct } from '../models/product';
import productGenerator from '../utils/generators/product.generator';

// Banned IP's
import BlockedIPGenerator from '../utils/generators/blockedIp.generator';
import BlockedIP, { IBlockedIP } from '../models/blockedIp';

// API Keys
import APIKey, { IAPIKey } from '../models/apiKey';
import APIKeyGenerator from '../utils/generators/APIKey.generator';

// Post
import Post, { IPOST } from '../models/post';
import postGenerator from '../utils/generators/post.generator';
import upload, { imageHandler, saveSharps } from '../middlewares/upload';
import datesReminder, { IDateReminder } from '../models/datesReminder';
import DateReminderGenerator from '../utils/generators/DateReminder.generator';
import FoodMenu, { IFoodItem } from '../models/FoodMenu';
import FoodItemGenerator from '../utils/generators/FoodItem.generator';

const api = Router();

api.use(
	'/users',
	new ApplyRoute<IUSER>(User, userGenerator, {
		index: {
			post: {
				before: [
					upload.single('avatar'),
					imageHandler([{ fieldName: 'avatar', dest: 'user/avatar', height: 200, width: 200 }]),
				],
				after: [saveSharps],
			},
		},
	}).router
);

api.use(
	'/products',
	new ApplyRoute<IProduct>(Product, productGenerator, {
		index: {
			post: {
				before: [
					upload.fields([
						{ name: 'thumbnails', maxCount: 20 },
						{ name: 'productImage', maxCount: 1 },
					]),
					imageHandler([
						{ fieldName: 'thumbnails', dest: 'products/thumbnails', multiple: true },
						{ fieldName: 'productImage', dest: 'products/product-image', multiple: false },
					]),
				],
				after: [saveSharps],
			},
		},
	}).router
);

api.use(
	'/posts',
	new ApplyRoute<IPOST>(Post, postGenerator, {
		index: {
			post: {
				before: [
					upload.fields([{ name: 'images', maxCount: 20 }]),
					imageHandler([{ fieldName: 'images', dest: 'posts/*/', multiple: true }]),
				],
				after: [saveSharps],
			},
		},
	}).router
);

api.use(
	'/dates-reminder',
	new ApplyRoute<IDateReminder>(datesReminder, DateReminderGenerator, {
		index: {
			post: {
				before: [
					upload.single('avatar'),
					imageHandler([{ fieldName: 'avatar', dest: 'dates-reminder-avatars/' }]),
				],
				after: [saveSharps],
			},
		},
	}).router
);

api.use(
	'/food-menu',
	new ApplyRoute<IFoodItem>(FoodMenu, FoodItemGenerator, {
		index: {
			post: {
				before: [upload.single('image'), imageHandler([{ fieldName: 'image', dest: 'food-menu/' }])],
				after: [saveSharps],
			},
		},
	}).router
);

api.use('/ban', new ApplyRoute<IBlockedIP>(BlockedIP, BlockedIPGenerator).router);

api.use('/api-keys', new ApplyRoute<IAPIKey>(APIKey, APIKeyGenerator).router);

api.use('/auth', authRoute);

/**
 * Main Router
 */
export default api;
