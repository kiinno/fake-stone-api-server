import { Router } from 'express';
import { login, verifyToken } from '../services/auth.service';
const router = Router();

router.post('/login', login);
router.post('/verify-token', verifyToken);

export default router;
