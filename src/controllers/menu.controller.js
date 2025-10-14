import {MenuItem, Ingredient} from '../models/index.js';

export async function listMenu(req, res) {
  const items = await MenuItem.findAll({where: {isActive: true}, include: Ingredient});
  res.json(items);
}

export async function getMenuItem(req, res) {
  const item = await MenuItem.findByPk(req.params.id, {include: Ingredient});
  if (!item) return res.status(404).json({error: 'not_found'});
  res.json(item);
}
