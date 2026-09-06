import * as categoryService from '../service/CategoryService.js';

export const createCategory = async (req, res) => {
    try {

        const { category } = req.body;
        const image = req.file?.filename;

        const result = await categoryService.createCategory(
            category,
            image
        );

        return res.status(201).json({
            message: 'Categoria criada com sucesso',
            id: result.id
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};

export const getAllCategories = async (req, res) => {
    try {

        const categories =
            await categoryService.getAllCategories();

        return res.json({
            categories
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

export const renameCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const { title } = req.body;

        await categoryService.renameCategory(
            id,
            title
        );

        return res.json({
            message: 'Categoria atualizada com sucesso'
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};

export const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;

        await categoryService.deleteCategory(id);

        return res.json({
            message: 'Categoria removida com sucesso'
        });

    } catch (error) {

        return res.status(400).json({
            message: error.message
        });

    }
};