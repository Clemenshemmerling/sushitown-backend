import { Router } from 'express';
import * as CartController from '../controllers/cart.controller.js';

const r = Router();

r.get('/', CartController.getCart);
r.post('/items', CartController.addItem);
r.put('/items/:itemId', CartController.updateItem);
r.delete('/items/:itemId', CartController.deleteItem);

export default r;
