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

const api = Router();

api.use(
	'/users',
	new ApplyRoute<IUSER>(User, userGenerator, {
		index: {
			post: {
				before: [upload.single('avatar'), imageHandler([{ fieldName: 'avatar', dest: 'user/avatar' }])],
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

api.use('/ban', new ApplyRoute<IBlockedIP>(BlockedIP, BlockedIPGenerator).router);

api.use('/api-keys', new ApplyRoute<IAPIKey>(APIKey, APIKeyGenerator).router);

api.use('/auth', authRoute);

export default api;
