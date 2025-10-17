import express from 'express';
import cors from 'cors';
import http from 'http';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import {Server} from 'socket.io';
import config from './config/config.js';
import db from './models/index.js';
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerSpec = YAML.load(path.resolve(__dirname, './docs/openapi.yaml'));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use((req, res, next) => {req.io = io; next()});

io.on('connection', socket => {
  socket.on('join_user', userId => {socket.join(`user_${userId}`)});
  socket.on('join_order', orderId => {socket.join(`order_${orderId}`)});
});

app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

await db.sequelize.sync();
server.listen(config.port);
