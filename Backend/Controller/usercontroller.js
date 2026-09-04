import db from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido no arquivo .env');
}

const JWT_SECRET = process.env.JWT_SECRET;

// ATENÇÃO: Antes de usar o código, garanta que a tabela users tem o campo "role" com:
// ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
// OU recrie a tabela com esse campo.

export const createUser = (name, email, password, role = 'user') => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, password, role], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

export const findUserEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

export const register = async (req, res) => {
  console.log('Dados recebidos no register:', req.body);
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const user = await findUserEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email já registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser(name, email, hashedPassword, role || 'user');
    res.status(201).json({ message: 'Usuário registrado com sucesso!', userId });
  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({ message: 'Erro interno.', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const user = await findUserEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login bem-sucedido!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro interno.', error: err.message });
  }
};

// Middleware para verificar admin
export const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Apenas admins.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
