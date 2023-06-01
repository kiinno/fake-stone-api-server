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

const api = Router();

api.use('/users', new ApplyRoute<IUSER>(User, userGenerator).router);

api.use('/products', new ApplyRoute<IProduct>(Product, productGenerator).router);

api.use('/posts', new ApplyRoute<IPOST>(Post, postGenerator).router);

api.use('/ban', new ApplyRoute<IBlockedIP>(BlockedIP, BlockedIPGenerator).router);

api.use('/api-keys', new ApplyRoute<IAPIKey>(APIKey, APIKeyGenerator).router);

api.use('/auth', authRoute);

export default api;
