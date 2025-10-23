import { Router } from 'express';
import { listOrders, patchStatus } from '../controllers/admin.orders.controller.js';
import { auth, requireRole } from '../middleware/auth.js';

const r = Router();
r.get('/', auth, requireRole('admin','cook','courier','staff'), listOrders);
r.patch('/:id/status', auth, requireRole('admin','cook','courier','staff'), patchStatus);
export default r;
