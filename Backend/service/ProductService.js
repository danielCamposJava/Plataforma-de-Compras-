import * as repository from "../repositories/ProductRespository.js";

// ======================================================
// CRIAR PRODUTO
// ======================================================

export const createProduct = async (data, file) => {
    const { name, description, price, category } = data;

    if (!name?.trim()) {
        throw new Error("Nome é obrigatório");
    }

    if (!description?.trim()) {
        throw new Error("Descrição é obrigatória");
    }

    if (price === undefined || price === null || price === "") {
        throw new Error("Preço é obrigatório");
    }

    if (!category?.trim()) {
        throw new Error("Categoria é obrigatória");
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
        throw new Error("Preço inválido");
    }

    const image = file
        ? `uploads/${file.filename}`
        : null;

    const result = await repository.create({
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        category: category.trim(),
        image
    });

    return {
        id: result.id,
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        category: category.trim(),
        image
    };
};

// ======================================================
// BUSCAR PRODUTO POR ID
// ======================================================

export const getProductById = async (id) => {
    const productId = Number(id);

    if (!productId) {
        throw new Error("ID do produto é obrigatório");
    }

    const product = await repository.findById(productId);

    if (!product) {
        throw new Error("Produto não encontrado");
    }

    return product;
};

// ======================================================
// BUSCAR TODOS OS PRODUTOS
// ======================================================

export const getAllProducts = async (
    page = 0,
    limit = 10
) => {
    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 0) {
        throw new Error("Página inválida");
    }

    if (!Number.isInteger(limit) || limit <= 0) {
        throw new Error("Limite inválido");
    }

    const offset = page * limit;

    const products = await repository.findAll(
        limit,
        offset
    );

    const countResult = await repository.count();

    return {
        data: Array.isArray(products)
            ? products
            : [],
        totalCount: countResult?.total || 0,
        page,
        limit
    };
};

// ======================================================
// ATUALIZAR PRODUTO
// ======================================================

export const updateProduct = async (
    id,
    data,
    file
) => {
    const productId = Number(id);

    if (!productId) {
        throw new Error("ID do produto é obrigatório");
    }

    const {
        name,
        description,
        price,
        category
    } = data;

    if (!name?.trim()) {
        throw new Error("Nome é obrigatório");
    }

    if (!description?.trim()) {
        throw new Error("Descrição é obrigatória");
    }

    if (price === undefined || price === null || price === "") {
        throw new Error("Preço é obrigatório");
    }

    if (!category?.trim()) {
        throw new Error("Categoria é obrigatória");
    }

    const numericPrice = Number(price);

    if (
        Number.isNaN(numericPrice) ||
        numericPrice < 0
    ) {
        throw new Error("Preço inválido");
    }

    const existingProduct =
        await repository.findById(productId);

    if (!existingProduct) {
        throw new Error("Produto não encontrado");
    }

    const image = file
        ? `uploads/${file.filename}`
        : existingProduct.image;

    const result = await repository.update(
        productId,
        {
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            image
        }
    );

    if (!result || result.changes === 0) {
        throw new Error(
            "Nenhuma alteração realizada"
        );
    }

    return await repository.findById(productId);
};

// ======================================================
// DELETAR PRODUTO
// ======================================================

export const deleteProduct = async (id) => {
    const productId = Number(id);

    if (!productId) {
        throw new Error("ID do produto é obrigatório");
    }

    const existingProduct =
        await repository.findById(productId);

    if (!existingProduct) {
        throw new Error("Produto não encontrado");
    }

    const result = await repository.remove(
        productId
    );

    if (!result || result.changes === 0) {
        throw new Error("Produto não encontrado");
    }

    return {
        message: "Produto deletado com sucesso"
    };
};