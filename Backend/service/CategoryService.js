
import * as categoryRepository from "../repositories/CategoryRepository.js";


export const createCategory = async (title, image) => {

    if (!title?.trim()) {
        throw new Error("Categoria é obrigatória");
    }

    if (!image) {
        throw new Error("Imagem é obrigatória");
    }

    return await categoryRepository.create(
        title.trim(),
        image
    );
};


export const getAllCategories = async () => {

    const categories = await categoryRepository.findAll();

    return Array.isArray(categories)
        ? categories
        : [];
};


export const renameCategory = async (id, title) => {

    if (!id) {
        throw new Error("ID é obrigatório");
    }

    if (!title?.trim()) {
        throw new Error("Novo nome é obrigatório");
    }

    const result = await categoryRepository.updateName(
        id,
        title.trim()
    );

    if (!result || result.changes === 0) {
        throw new Error("Categoria não encontrada");
    }

    return result;
};


export const deleteCategory = async (id) => {

    if (!id) {
        throw new Error("ID é obrigatório");
    }

    const result = await categoryRepository.remove(id);

    if (!result || result.changes === 0) {
        throw new Error("Categoria não encontrada");
    }

    return result;
};

