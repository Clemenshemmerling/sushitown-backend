import {Router} from 'express';
import {auth} from '../middleware/auth.js';
import {createOrder, getOrderById, listMyOrders} from '../controllers/orders.controller.js';

const r = Router();

r.post('/', auth, createOrder);
r.get('/me/list', auth, listMyOrders);
r.get('/:id', auth, getOrderById);

export default r;
