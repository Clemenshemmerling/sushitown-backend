import { Router } from 'express';
import {auth, requireRole} from '../middleware/auth.js';
import {createIngredient, createMenuItem, listOrders, updateOrderStatus} from '../controllers/admin.controller.js';

const r = Router();

r.post('/ingredients', auth, requireRole('admin', 'staff'), createIngredient);
r.post('/menu-items', auth, requireRole('admin', 'staff'), createMenuItem);
r.get('/orders', auth, requireRole('admin', 'staff'), listOrders);
r.patch('/orders/:id/status', auth, requireRole('admin', 'staff'), updateOrderStatus);

export default r;
