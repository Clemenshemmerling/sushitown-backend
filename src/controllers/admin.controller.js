import {Ingredient, MenuItem, Order} from '../models/index.js';

export async function createIngredient(req, res) {
  const {name, priceDelta, isAvailable} = req.body;
  const ing = await Ingredient.create({name, priceDelta, isAvailable});
  res.json(ing);
}

export async function createMenuItem(req, res) {
  const {name, description, basePrice, isActive, ingredientIds} = req.body;
  const mi = await MenuItem.create({name, description, basePrice, isActive});
  if (Array.isArray(ingredientIds) && ingredientIds.length) {
    const ings = await Ingredient.findAll({where: {id: ingredientIds}});
    await mi.setIngredients(ings);
  }
  res.json(mi);
}

export async function listOrders(req, res) {
  const list = await Order.findAll({order: [['createdAt', 'DESC']]});
  res.json(list);
}

export async function updateOrderStatus(req, res) {
  const {status} = req.body;
  const o = await Order.findByPk(req.params.id);
  if (!o) return res.status(404).json({error: 'not_found'});
  o.status = status;
  await o.save();
  req.io.to(`order_${o.id}`).emit('order_status', {id: o.id, status: o.status});
  req.io.to(`user_${o.UserId}`).emit('order_status', {id: o.id, status: o.status});
  res.json(o);
}

