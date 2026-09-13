import db from '../config/database.js';
import { notifyNewOrder } from '../server.js'; // Para emitir eventos via Socket.io

// Buscar pedidos de um usuário específico
export const getUserOrders = (req, res) => {
  const userId = req.userId;

  const query = `SELECT * FROM orders WHERE user_id = ?`;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao obter pedidos', error: err.message });
    }
    res.status(200).json({ orders: rows });
  });
};

// Criar um pedido com os itens do carrinho
export const createOrder = (req, res) => {
  const {
    user_id,
    total,
    paymentMethod,
    customerName = '',
    phoneNumber = '',
    discount = 0,
    cartItems
  } = req.body;

  if (!total || !paymentMethod || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando ou carrinho vazio' });
  }

  const totalAmount = total - discount;

  const orderQuery = `
    INSERT INTO orders (user_id, total, payment_method, customer_name, phone_number, discount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Pendente')
  `;

  db.run(orderQuery, [user_id, totalAmount, paymentMethod, customerName, phoneNumber, discount], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar pedido', error: err.message });
    }

    const orderId = this.lastID;

    const orderItemQuery = `
      INSERT INTO order_items (order_id, food_id, quantity, price, name, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const insertItems = cartItems.map(item => {
      const foodId = item.productId;
      if (!foodId) {
        return Promise.reject(new Error('Item do carrinho sem productId'));
      }

      return new Promise((resolve, reject) => {
        db.run(orderItemQuery, [
          orderId,
          foodId,
          item.quantity,
          item.price,
          item.name || '',
          item.description || '',
          item.image || ''
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    Promise.all(insertItems)
      .then(() => {
        const getItemsQuery = `SELECT * FROM order_items WHERE order_id = ?`;
        db.all(getItemsQuery, [orderId], (errItems, items) => {
          if (errItems) {
            console.error('Erro ao buscar itens do pedido para WebSocket:', errItems.message);
          }

          const newOrderData = {
            id: orderId,
            user_id,
            total: totalAmount,
            payment_method: paymentMethod,
            customer_name: customerName,
            phone_number: phoneNumber,
            discount,
            status: 'Pendente',
            created_at: new Date().toISOString(),
            items: items || []
          };

          notifyNewOrder(newOrderData); // envia tudo para o painel admin

          res.status(201).json({ message: 'Pedido criado com sucesso', orderId });
        });
      })
      .catch(err => {
        res.status(500).json({ message: 'Erro ao adicionar itens ao pedido', error: err.message });
      });
  });
};

// Buscar todos os pedidos com seus itens - para admin
export const getAllOrdersWithItems = (req, res) => {
  const query = `
    SELECT
      o.id AS order_id,
      o.user_id,
      o.total,
      o.payment_method,
      o.customer_name,
      o.phone_number,
      o.discount,
      o.status,
      o.created_at,
      oi.id AS order_item_id,
      oi.food_id,
      oi.quantity,
      oi.price,
      oi.name AS item_name,
      oi.description AS item_description,
      oi.image AS item_image
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    ORDER BY o.id DESC, oi.id;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao buscar pedidos com itens', error: err.message });
    }

    const ordersMap = new Map();

    rows.forEach(row => {
      const orderId = row.order_id;

      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          id: orderId,
          user_id: row.user_id,
          total: row.total,
          payment_method: row.payment_method,
          customer_name: row.customer_name,
          phone_number: row.phone_number,
          discount: row.discount,
          status: row.status,
          created_at: row.created_at,
          items: []
        });
      }

      if (row.order_item_id) {
        ordersMap.get(orderId).items.push({
          id: row.order_item_id,
          food_id: row.food_id,
          quantity: row.quantity,
          price: row.price,
          name: row.item_name,
          description: row.item_description,
          image: row.item_image
        });
      }
    });

    const ordersArray = Array.from(ordersMap.values());

    res.status(200).json({ orders: ordersArray });
  });
};

// Criar um item de pedido individual
export const createOrderItem = (req, res) => {
  const { order_id, food_id, quantity, price, name, description, image } = req.body;

  const query = `
    INSERT INTO order_items (order_id, food_id, quantity, price, name, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [order_id, food_id, quantity, price, name, description, image], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criar item de pedido', error: err.message });
    }
    res.status(201).json({ message: 'Item de pedido criado com sucesso!', orderItemId: this.lastID });
  });
};

// Buscar itens de um pedido
export const getOrderItems = (req, res) => {
  const { order_id } = req.params;

  const query = `SELECT * FROM order_items WHERE order_id = ?`;

  db.all(query, [order_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao obter itens do pedido', error: err.message });
    }
    res.status(200).json({ orderItems: rows });
  });
};

// ✅ Atualizar status do pedido (ex: "Enviado")
export const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status é obrigatório' });
  }

  const query = `UPDATE orders SET status = ? WHERE id = ?`;

  db.run(query, [status, id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Status do pedido atualizado com sucesso' });
  });
};
