
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ======================================================
// CAMINHO ABSOLUTO DO BANCO
// ======================================================

const dbPath = path.resolve(
    __dirname,
    "..",
    "database.sqlite"
);

console.log("========================================");
console.log("📁 BANCO SQLITE:");
console.log(dbPath);
console.log("========================================");


// ======================================================
// CONEXÃO COM BANCO
// ======================================================

const db = new sqlite3.Database(
    dbPath,
    (err) => {

        if (err) {

            console.error(
                "❌ Erro ao conectar ao banco:",
                err.message
            );

            return;
        }

        console.log(
            "✅ Conexão com o banco de dados estabelecida."
        );
    }
);


// ======================================================
// EXECUTAR SQL
// ======================================================

function run(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.run(
            sql,
            params,
            function (err) {

                if (err) {
                    return reject(err);
                }

                resolve(this);
            }
        );

    });
}


// ======================================================
// BUSCAR UM REGISTRO
// ======================================================

function get(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.get(
            sql,
            params,
            (err, row) => {

                if (err) {
                    return reject(err);
                }

                resolve(row);
            }
        );

    });
}


// ======================================================
// BUSCAR VÁRIOS REGISTROS
// ======================================================

function all(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.all(
            sql,
            params,
            (err, rows) => {

                if (err) {
                    return reject(err);
                }

                resolve(rows);
            }
        );

    });
}

db.all("SELECT * FROM products", (err, rows) => {
    if (err) {
        console.error("❌ ERRO AO CONSULTAR PRODUCTS:", err.message);
        return;
    }

    console.log("========================================");
    console.log("📦 PRODUTOS EXISTENTES NO BANCO:");
    console.log(rows);
    console.log("📊 TOTAL:", rows.length);
    console.log("========================================");
});


// ======================================================
// EXPORTAR
// ======================================================

db.run("PRAGMA foreign_keys = ON");

export {
    run,
    get,
    all
};

export default db;
