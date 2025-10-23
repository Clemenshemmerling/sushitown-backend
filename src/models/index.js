import sequelize from '../config/db.js';
import User from './user.js';
import Ingredient from './ingredient.js';
import MenuItem from './menu-item.js';
import MenuItemIngredient from './menu-item-ingredient.js';
import Promotion from './promotion.js';
import Order from './order.js';
import OrderItem from './order-item.js';
import OrderItemIngredient from './order-item-ingredient.js';
import Cart from './cart.js';
import CartItem from './cart-item.js';

MenuItem.belongsToMany(Ingredient, { through: MenuItemIngredient });
Ingredient.belongsToMany(MenuItem, { through: MenuItemIngredient });

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });

OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId' });

OrderItemIngredient.belongsTo(OrderItem, { foreignKey: 'orderItemId' });
OrderItem.hasMany(OrderItemIngredient, { foreignKey: 'orderItemId' });

OrderItemIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' });
Ingredient.hasMany(OrderItemIngredient, { foreignKey: 'ingredientId' });

User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

MenuItem.hasMany(CartItem, { foreignKey: 'menuItemId' });
CartItem.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

export { sequelize, User, Ingredient, MenuItem, MenuItemIngredient, Promotion, Order, OrderItem, OrderItemIngredient, Cart, CartItem };
export default { sequelize, User, Ingredient, MenuItem, MenuItemIngredient, Promotion, Order, OrderItem, OrderItemIngredient, Cart, CartItem };
