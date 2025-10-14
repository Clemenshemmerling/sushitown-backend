import {sequelize, Order, OrderItem, OrderItemIngredient, MenuItem, Ingredient} from '../models/index.js';

export async function createOrder(req, res) {
  const {items, address, notes} = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({error: 'invalid'});
  const t = await sequelize.transaction();
  try {
    const order = await Order.create({UserId: req.user.id, address, notes}, {transaction: t});
    let total = 0;
    for (const it of items) {
      const m = await MenuItem.findByPk(it.menuItemId);
      if (!m) throw new Error('invalid_item');
      const qty = it.quantity || 1;
      let unit = Number(m.basePrice);
      const oi = await OrderItem.create({OrderId: order.id, MenuItemId: m.id, quantity: qty, unitPrice: unit, subtotal: 0}, {transaction: t});
      let delta = 0;
      if (Array.isArray(it.additions)) {
        for (const ingId of it.additions) {
          const ing = await Ingredient.findByPk(ingId);
          if (ing) {
            const d = Number(ing.priceDelta || 0);
            delta += d;
            await OrderItemIngredient.create({OrderItemId: oi.id, IngredientId: ing.id, action: 'add', priceDelta: d}, {transaction: t});
          }
        }
      }
      if (Array.isArray(it.removals)) {
        for (const ingId of it.removals) {
          const ing = await Ingredient.findByPk(ingId);
          if (ing) {
            await OrderItemIngredient.create({OrderItemId: oi.id, IngredientId: ing.id, action: 'remove', priceDelta: 0}, {transaction: t});
          }
        }
      }
      unit += delta;
      const subtotal = unit * qty;
      oi.unitPrice = unit;
      oi.subtotal = subtotal;
      await oi.save({transaction: t});
      total += subtotal;
    }
    order.total = total;
    await order.save({transaction: t});
    await t.commit();
    req.io.to(`user_${req.user.id}`).emit('order_created', {id: order.id, total: order.total, status: order.status});
    res.json({id: order.id, total: order.total, status: order.status});
  } catch (e) {
    await t.rollback();
    res.status(400).json({error: 'invalid'});
  }
}

export async function getOrderById(req, res) {
  const o = await Order.findByPk(req.params.id, {include: [{model: OrderItem, include: [MenuItem, OrderItemIngredient]}]});
  if (!o || o.UserId !== req.user.id) return res.status(404).json({error: 'not_found'});
  res.json(o);
}

export async function listMyOrders(req, res) {
  const os = await Order.findAll({where: {UserId: req.user.id}, order: [['createdAt', 'DESC']]});
  res.json(os);
}

