import {Sequelize} from 'sequelize';
import config from './config.js';

const sequelize = new Sequelize(config.db, {dialect: 'postgres', logging: false});

export default sequelize;
