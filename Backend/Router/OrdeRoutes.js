import express from 'express';
import {
  createOrder,
  createOrderItem,
  getOrderItems,
  getUserOrders,
  getAllOrdersWithItems,
  updateOrderStatus
} from '../controller/OrderController.js';
import {authenticateToken } from '../Middleware/authtenticationToken.js';

const router = express.Router();

router.put('/orders/:id/status', authenticateToken, updateOrderStatus);

// Criar pedido (rota protegida)
router.post('/orders', authenticateToken, createOrder);

// Obter pedidos do usuário autenticado
router.get('/orders/user', authenticateToken, getUserOrders);

// Obter todos os pedidos com itens (somente admin)
router.get('/orders/all', authenticateToken, getAllOrdersWithItems);

// Criar item de pedido
router.post('/order-items',  createOrderItem);

// Obter itens de um pedido específico
router.get('/order-items/:order_id', authenticateToken, getOrderItems);

export default router;
