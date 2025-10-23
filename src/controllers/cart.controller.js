import { Cart, CartItem, MenuItem, Ingredient } from '../models/index.js';

const findOrCreateCart = async (userId) => {
  const [cart] = await Cart.findOrCreate({ where: { userId, status: 'active' }, defaults: { userId, status: 'active' } });
  return cart;
};

export async function getCart(req, res) {
  const userId = req.user.id;
  const cart = await Cart.findOne({
    where: { userId, status: 'active' },
    include: [{ model: CartItem, include: [MenuItem] }]
  });
  res.json(cart || { id: null, CartItems: [] });
}

export async function addItem(req, res) {
  const userId = req.user.id;
  const { menuItemId, quantity = 1, addedIngredientIds = [], removedIngredientIds = [], notes } = req.body;
  const cart = await findOrCreateCart(userId);
  const menuItem = await MenuItem.findByPk(menuItemId);
  if (!menuItem) return res.status(404).json({ error: 'menu_item_not_found' });
  let unitPrice = Number(menuItem.basePrice || 0);
  if (addedIngredientIds.length) {
    const extras = await Ingredient.findAll({ where: { id: addedIngredientIds } });
    unitPrice += extras.reduce((s, x) => s + Number(x.extraPrice || 0), 0);
  }
  const lineTotal = unitPrice * Number(quantity);
  const item = await CartItem.create({
    cartId: cart.id,
    menuItemId,
    quantity,
    unitPrice,
    lineTotal,
    addedIngredientIds,
    removedIngredientIds,
    notes
  });
  const created = await CartItem.findByPk(item.id, { include: [MenuItem] });
  res.status(201).json(created);
}

export async function updateItem(req, res) {
  const userId = req.user.id;
  const { itemId } = req.params;
  const { quantity, addedIngredientIds, removedIngredientIds, notes } = req.body;
  const cart = await findOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) return res.status(404).json({ error: 'item_not_found' });

  let unitPrice = Number(item.unitPrice);
  let recalc = addedIngredientIds !== undefined || removedIngredientIds !== undefined;
  if (recalc) {
    const menuItem = await MenuItem.findByPk(item.menuItemId);
    unitPrice = Number(menuItem.basePrice || 0);
    const addIds = addedIngredientIds ?? item.addedIngredientIds ?? [];
    if (addIds.length) {
      const extras = await Ingredient.findAll({ where: { id: addIds } });
      unitPrice += extras.reduce((s, x) => s + Number(x.extraPrice || 0), 0);
    }
  }
  const newQty = quantity !== undefined ? Number(quantity) : Number(item.quantity);
  const lineTotal = unitPrice * newQty;

  await item.update({
    quantity: newQty,
    unitPrice,
    lineTotal,
    addedIngredientIds: addedIngredientIds ?? item.addedIngredientIds,
    removedIngredientIds: removedIngredientIds ?? item.removedIngredientIds,
    notes: notes ?? item.notes
  });

  const updated = await CartItem.findByPk(item.id, { include: [MenuItem] });
  res.json(updated);
}

export async function deleteItem(req, res) {
  const userId = req.user.id;
  const { itemId } = req.params;
  const cart = await findOrCreateCart(userId);
  const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
  if (!item) return res.status(404).json({ error: 'item_not_found' });
  await item.destroy();
  res.status(204).end();
}
