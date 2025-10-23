import { sequelize } from '../models/index.js';
import { Cart, CartItem, MenuItem, Ingredient, Order, OrderItem, OrderItemIngredient, User } from '../models/index.js';

export async function checkout(req, res) {
  const userId = req.user.id;

  const t = await sequelize.transaction();
  try {
    const cart = await Cart.findOne({
      where: { userId, status: 'active' },
      include: [{ model: CartItem }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'cart_empty' });
    }

    const user = await User.findByPk(userId, { transaction: t });
    const address = req.body.address ?? user?.addressLine1 ?? null;
    const deliveryLocation = req.body.deliveryLocation ?? null;

    for (const it of cart.CartItems) {
      if (!it.quantity || it.quantity < 1) {
        await t.rollback();
        return res.status(400).json({ error: 'invalid_quantity', itemId: it.id });
      }
    }

    const menuIds = [...new Set(cart.CartItems.map(i => i.menuItemId))];
    const menuMap = new Map(
      (await MenuItem.findAll({ where: { id: menuIds }, transaction: t }))
        .map(m => [m.id, m])
    );

    const allAddIds = [
      ...new Set(
        cart.CartItems.flatMap(i => Array.isArray(i.addedIngredientIds) ? i.addedIngredientIds : [])
      )
    ];
    const ingMap = new Map(
      (allAddIds.length
        ? await Ingredient.findAll({ where: { id: allAddIds }, transaction: t })
        : []
      ).map(ing => [ing.id, ing])
    );

    const orderItemsPayload = [];
    const oiIngredientsPayload = [];
    let total = 0;

    for (const it of cart.CartItems) {
      const menu = menuMap.get(it.menuItemId);
      if (!menu) {
        await t.rollback();
        return res.status(400).json({ error: 'menu_item_not_found', menuItemId: it.menuItemId });
      }

      const addIds = Array.isArray(it.addedIngredientIds) ? it.addedIngredientIds : [];
      const remIds = Array.isArray(it.removedIngredientIds) ? it.removedIngredientIds : [];

      let unitPrice = Number(menu.basePrice || 0);
      if (addIds.length) {
        for (const id of addIds) {
          const ing = ingMap.get(id);
          unitPrice += Number(ing?.extraPrice || 0);
        }
      }
      const lineTotal = unitPrice * Number(it.quantity);
      total += lineTotal;

      orderItemsPayload.push({
        orderId: null,
        menuItemId: it.menuItemId,
        quantity: it.quantity,
        unitPrice,
        subtotal: lineTotal
      });

      for (const id of addIds) {
        oiIngredientsPayload.push({
          orderItemId: null,
          ingredientId: id,
          action: 'add',
          priceDelta: Number(ingMap.get(id)?.extraPrice || 0)
        });
      }
      for (const id of (Array.isArray(remIds) ? remIds : [])) {
        oiIngredientsPayload.push({
          orderItemId: null,
          ingredientId: id,
          action: 'remove',
          priceDelta: 0
        });
      }
    }

    const order = await Order.create({
      userId,
      status: 'pending',
      total,
      address,
      notes: req.body.notes || null,
      deliveryLocationSnapshot: deliveryLocation,
      receivedAt: new Date()
    }, { transaction: t });

    const createdOrderItems = await OrderItem.bulkCreate(
      orderItemsPayload.map(x => ({ ...x, orderId: order.id })),
      { transaction: t, returning: true }
    );

    const withOrderItemId = [];
    let cursor = 0;
    for (let idx = 0; idx < createdOrderItems.length; idx++) {
      const oi = createdOrderItems[idx];
      const base = orderItemsPayload[idx];

      const addCount = oiIngredientsPayload.slice(cursor).filter(x => x.orderItemId === null && x.action === 'add').length;
      const remCount = oiIngredientsPayload.slice(cursor).filter(x => x.orderItemId === null && x.action === 'remove').length;

      const itemAdds = [];
      const itemRems = [];

      let i = cursor;
      while (i < oiIngredientsPayload.length && withOrderItemId.length < oiIngredientsPayload.length) {
        const rec = oiIngredientsPayload[i];
        if (rec.orderItemId !== null) { i++; continue; }
        const countForThisItem = itemAdds.length + itemRems.length;
        if (countForThisItem >= (addCount + remCount)) break;
        if (countForThisItem < (addCount + remCount)) {
          rec.orderItemId = oi.id;
          withOrderItemId.push(rec);
        }
        i++;
      }
      cursor = i;
    }

    const finalOiIngs = withOrderItemId.length ? withOrderItemId : oiIngredientsPayload.map(r => ({ ...r, orderItemId: createdOrderItems[0]?.id || null }));
    if (finalOiIngs.length && finalOiIngs[0].orderItemId) {
      await OrderItemIngredient.bulkCreate(finalOiIngs, { transaction: t });
    }

    await cart.update({ status: 'checked_out' }, { transaction: t });

    await t.commit();
    res.status(201).json({ id: order.id, status: order.status, total: order.total });
  } catch (e) {
    if (t.finished !== 'commit') await t.rollback();
    res.status(500).json({ error: 'checkout_failed' });
  }
}
