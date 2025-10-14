import sequelize from '../config/db.js';
import User from './user.js';
import Ingredient from './ingredient.js';
import MenuItem from './menu-item.js';
import MenuItemIngredient from './menu-item-ingredient.js';
import Promotion from './promotion.js';
import Order from './order.js';
import OrderItem from './order-item.js';
import OrderItemIngredient from './order-item-ingredient.js';

MenuItem.belongsToMany(Ingredient, {through: MenuItemIngredient});
Ingredient.belongsToMany(MenuItem, {through: MenuItemIngredient});

Order.belongsTo(User);
User.hasMany(Order);

OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);

OrderItem.belongsTo(MenuItem);
MenuItem.hasMany(OrderItem);

OrderItemIngredient.belongsTo(OrderItem);
OrderItem.hasMany(OrderItemIngredient);

OrderItemIngredient.belongsTo(Ingredient);
Ingredient.hasMany(OrderItemIngredient);

export {sequelize, User, Ingredient, MenuItem, MenuItemIngredient, Promotion, Order, OrderItem, OrderItemIngredient};
export default {sequelize, User, Ingredient, MenuItem, MenuItemIngredient, Promotion, Order, OrderItem, OrderItemIngredient};
