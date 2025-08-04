import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import foodRoutes from './Router/foodRouter.js';
import userRoutes from './Router/userRoutes.js';
import orderRoutes from './Router/createOrdeRoutes.js';
import categoryRoutes from './Router/categoryRouter.js';
import tableRoutes from './Router/tableRouter.js';
import bookingRoutes from './Router/bookingRouter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);

// 🔐 Configuração CORS flexível
const isDev = process.env.NODE_ENV !== 'production';

const allowedOrigins = isDev
  ? [/^http:\/\/localhost:\d+$/] // aceita qualquer porta localhost
  : ['https://delivery-br1d.vercel.app']; // produção

function checkOrigin(origin, callback) {
  if (!origin) return callback(null, true);
  const isAllowed = allowedOrigins.some((allowed) =>
    allowed instanceof RegExp ? allowed.test(origin) : allowed === origin
  );

  if (!isAllowed) {
    const msg = `A política de CORS bloqueou a origem ${origin}.`;
    return callback(new Error(msg), false);
  }

  return callback(null, true);
}

// 🔌 Configuração do Socket.IO
const io = new Server(server, {
  cors: {
    origin: checkOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

app.set('io', io);

// 🧩 Middlewares
app.use(express.json());

app.use(cors({
  origin: checkOrigin,
  credentials: true,
}));

// 📂 Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'Config', 'Uploads')));

// 🚀 Rotas principais
app.get('/', (req, res) => {
  res.send('API Working com Socket.io');
});

app.use('/api', orderRoutes);
app.use('/api/foods', foodRoutes);
app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/tables', tableRoutes);
app.use('/booking', bookingRoutes);

// ❌ Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// 🔁 Socket.IO: escutando conexões
io.on('connection', (socket) => {
  console.log('Novo cliente conectado via WebSocket:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// 🔔 Emitir evento de novo pedido
export const notifyNewOrder = (order) => {
  io.emit('newOrder', order);
};

// ▶️ Iniciar servidor
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
