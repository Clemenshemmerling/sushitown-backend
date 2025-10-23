import { Order, OrderItem, OrderItemIngredient, MenuItem, Ingredient, User } from '../models/index.js';

const includeTree = [
  { model: User, attributes: ['id','name','email'] },
  { model: OrderItem, include: [
      { model: MenuItem },
      { model: OrderItemIngredient, include: [Ingredient] }
    ]
  }
];

export async function listOrders(req, res) {
  const where = {};
  if (req.query.status) where.status = req.query.status;
  const orders = await Order.findAll({ where, order: [['createdAt','DESC']], include: includeTree });
  res.json(orders);
}

const valid = new Set(['pending','accepted','preparing','ready','out_for_delivery','completed','cancelled']);
const nextAllowed = {
  pending: ['accepted','cancelled'],
  accepted: ['preparing','cancelled'],
  preparing: ['ready','cancelled'],
  ready: ['out_for_delivery','cancelled'],
  out_for_delivery: ['completed','cancelled'],
  completed: [],
  cancelled: []
};

export async function patchStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!valid.has(status)) return res.status(400).json({ error: 'invalid_status' });
  const order = await Order.findByPk(id);
  if (!order) return res.status(404).json({ error: 'not_found' });
  const allowed = nextAllowed[order.status] || [];
  if (!allowed.includes(status)) return res.status(409).json({ error: 'transition_not_allowed', from: order.status, to: status });

  const stamp = {
    accepted: 'acceptedAt',
    preparing: 'preparingAt',
    ready: 'readyAt',
    out_for_delivery: 'outForDeliveryAt',
    completed: 'completedAt',
    cancelled: 'cancelledAt'
  }[status];

  const patch = { status };
  if (stamp) patch[stamp] = new Date();
  await order.update(patch);
  res.json({ id: order.id, status: order.status });
}
