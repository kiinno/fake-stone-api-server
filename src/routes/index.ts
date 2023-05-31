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

const api = Router();

api.use('/users', new ApplyRoute<IUSER>(User, userGenerator).router);

api.use('/products', new ApplyRoute<IProduct>(Product, productGenerator).router);

api.use('/banned', new ApplyRoute<IBlockedIP>(BlockedIP, BlockedIPGenerator).router);

api.use('/auth', authRoute);

export default api;
