import { Router } from 'express';
import { checkout } from '../controllers/checkout.controller.js';
import { auth } from '../middleware/auth.js';

const r = Router();
r.post('/', auth, checkout);
export default r;
