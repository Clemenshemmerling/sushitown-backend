import { Router } from 'express';
import { listMenu, getMenuItem } from '../controllers/menu.controller.js';

const r = Router();

r.get('/', listMenu);
r.get('/:id', getMenuItem);

export default r;
