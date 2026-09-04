import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('❌ Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('✅ Conexão com o banco de dados estabelecida.');
    addStatusColumnIfNotExists();
    addIconColumnIfNotExists();
  }
});

// Função para log automático
function log(tableName) {
  return (err) => {
    if (err) {
      console.error(`❌ Erro ao criar/verificar tabela "${tableName}":`, err.message);
    } else {
      console.log(`✅ Tabela "${tableName}" criada/verificada com sucesso.`);
    }
  };
}

// -------------------- TABELA category --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT
  )
`, log('category'));

// -------------------- TABELA users --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'
  )
`, log('users'));

// -------------------- TABELA tables --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    location TEXT,
    is_available INTEGER DEFAULT 1,
    icon TEXT DEFAULT 'MdTableRestaurant',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  log('tables')(err);
  if (!err) {
    addIconColumnIfNotExists();
    seedTablesIfEmpty(); // ✅ Popula 50 mesas automaticamente se vazio
  }
});

// -------------------- TABELA booking --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS booking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    table_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'Pendente',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (table_id) REFERENCES tables(id)
  )
`, log('booking'));

// -------------------- TABELA foods --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    section_id INTEGER,
    FOREIGN KEY (section_id) REFERENCES category(id)
  )
`, log('foods'));

// -------------------- MIGRAÇÃO foods -> products --------------------

db.get(`
    SELECT name
    FROM sqlite_master
    WHERE type='table'
    AND name='foods'
`, [], (err, row) => {

    if (err) {
        console.error(
            '❌ Erro ao verificar tabela foods:',
            err.message
        );
        return;
    }

    if (row) {

        db.run(`
            ALTER TABLE foods
            RENAME TO products
        `, (err) => {

            if (err) {
                console.error(
                    '❌ Erro ao renomear foods para products:',
                    err.message
                );
            } else {
                console.log(
                    '✅ Tabela foods renomeada para products'
                );
            }
        });
    }
});

// -------------------- TABELA products --------------------

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    section_id INTEGER,
    FOREIGN KEY (section_id) REFERENCES category(id)
  )
`, log('products'));

// -------------------- TABELA orders --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    payment_method TEXT NOT NULL,
    customer_name TEXT DEFAULT '',
    phone_number TEXT DEFAULT '',
    discount REAL DEFAULT 0,
    status TEXT DEFAULT 'pendente',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  log('orders')(err);
  if (!err) {
    addStatusColumnIfNotExists();
  }
});

// -------------------- TABELA order_items --------------------
db.run(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    food_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    name TEXT DEFAULT '',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (food_id) REFERENCES products(id)
  )
`, log('order_items'));

// -------------------- Migração de coluna "status" --------------------
function addStatusColumnIfNotExists() {
  db.all(`PRAGMA table_info(orders)`, (err, columns) => {
    if (err) {
      console.error('❌ Erro ao obter colunas da tabela orders:', err.message);
      return;
    }

    const hasStatus = columns.some(col => col.name === 'status');
    if (!hasStatus) {
      db.run(`ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pendente'`, (err) => {
        if (err) {
          console.error('❌ Erro ao adicionar coluna status na tabela orders:', err.message);
        } else {
          console.log('✅ Coluna "status" adicionada na tabela orders.');
        }
      });
    } else {
      console.log('✅ Coluna "status" já existe na tabela orders.');
    }
  });
}

// -------------------- Migração para coluna "icon" na tabela tables --------------------
function addIconColumnIfNotExists() {
  db.all(`PRAGMA table_info(tables)`, (err, columns) => {
    if (err) {
      console.error('❌ Erro ao obter colunas da tabela tables:', err.message);
      return;
    }

    const hasIcon = columns.some(col => col.name === 'icon');
    if (!hasIcon) {
      db.run(`ALTER TABLE tables ADD COLUMN icon TEXT DEFAULT 'MdTableRestaurant'`, (err) => {
        if (err) {
          console.error('❌ Erro ao adicionar coluna icon na tabela tables:', err.message);
        } else {
          console.log('✅ Coluna "icon" adicionada na tabela tables.');
        }
      });
    } else {
      console.log('✅ Coluna "icon" já existe na tabela tables.');
    }
  });
}

// -------------------- Seed automático das 50 mesas --------------------
function seedTablesIfEmpty() {
  db.get(`SELECT COUNT(*) AS total FROM tables`, (err, row) => {
    if (err) {
      console.error('❌ Erro ao verificar quantidade de mesas:', err.message);
      return;
    }

    if (row.total === 0) {
      console.log('ℹ️ Nenhuma mesa encontrada. Populando 50 mesas...');
      const locations = ['A', 'B', 'C', 'D', 'E'];
      const capacities = [2, 4, 6];
      const icons = ['MdTableRestaurant', 'GiTable', 'TbTable', 'AiOutlineTable'];

      const insertSql = `INSERT INTO tables (name, capacity, location, is_available, icon) VALUES (?, ?, ?, ?, ?)`;

      for (let i = 1; i <= 50; i++) {
        const name = `Mesa ${i}`;
        const capacity = capacities[Math.floor(Math.random() * capacities.length)];
        const location = locations[i % locations.length];
        const is_available = Math.random() < 0.7 ? 1 : 0;
        const icon = icons[i % icons.length];

        db.run(insertSql, [name, capacity, location, is_available, icon], function (err) {
          if (err) {
            console.error(`❌ Erro ao inserir ${name}:`, err.message);
          } else {
            console.log(`✅ Mesa ${name} criada com ID ${this.lastID}`);
          }
        });
      }
    } else {
      console.log(`✅ Tabela "tables" já possui ${row.total} mesa(s). Não foi necessário popular.`);
    }
  });
}

export default db;
