import { Router } from 'express';
import { login, verifyToken } from '../services/auth.service';
import { authenticate } from '../middlewares/guard';
const router = Router();

router.post('/login', login);
router.post('/verify-token', authenticate, verifyToken);

/**
 * Authentication Router
 */
export default router;
