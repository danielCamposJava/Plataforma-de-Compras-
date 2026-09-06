
import { run, get, all } from "../config/database.js";

// ======================================================
// CRIAR PRODUTO
// ======================================================

export const create = async (product) => {
    const sql = `
        INSERT INTO products (
            name,
            description,
            price,
            category,
            image
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    return await run(sql, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.image
    ]);
};

// ======================================================
// BUSCAR POR ID
// ======================================================

export const findById = async (id) => {
    console.log("========================================");
    console.log("🔎 BUSCANDO PRODUTO POR ID");
    console.log("ID recebido:", id);
    console.log("Tipo do ID:", typeof id);

    const sql = `
        SELECT *
        FROM products
        WHERE id = ?
    `;

    try {
        const product = await get(sql, [id]);

        console.log("📦 PRODUTO ENCONTRADO:", product);
        console.log("========================================");

        return product;
    } catch (error) {
        console.error("❌ ERRO AO BUSCAR PRODUTO:", error);
        throw error;
    }
};

// ======================================================
// BUSCAR TODOS
// ======================================================

export const findAll = async (limit = 10, offset = 0) => {
    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
        LIMIT ?
        OFFSET ?
    `;

    return await all(sql, [limit, offset]);
};

// ======================================================
// CONTAR
// ======================================================

export const count = async () => {
    const sql = `
        SELECT COUNT(*) AS total
        FROM products
    `;

    return await get(sql);
};

// ======================================================
// ATUALIZAR
// ======================================================

export const update = async (id, product) => {
    const sql = `
        UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            category = ?,
            image = ?
        WHERE id = ?
    `;

    return await run(sql, [
        product.name,
        product.description,
        product.price,
        product.category,
        product.image,
        id
    ]);
};

// ======================================================
// DELETAR
// ======================================================

export const remove = async (id) => {
    const sql = `
        DELETE FROM products
        WHERE id = ?
    `;

    return await run(sql, [id]);
};

