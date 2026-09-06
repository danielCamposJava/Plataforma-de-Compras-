
import * as service from "../service/ProductService.js";


// ======================================================
// CRIAR
// ======================================================

export const createProduct = async (req, res) => {

    try {

        const product =
            await service.createProduct(
                req.body,
                req.file
            );


        return res
            .status(201)
            .json(product);

    } catch (error) {

        console.error(
            "Erro ao criar produto:",
            error
        );


        return res
            .status(400)
            .json({
                message: error.message
            });
    }
};


// ======================================================
// BUSCAR POR ID
// ======================================================

export const getProductById = async (req, res) => {

    try {

        const { id } = req.params;


        const product =
            await service.getProductById(id);


        return res
            .status(200)
            .json(product);

    } catch (error) {

        console.error(
            "Erro ao buscar produto:",
            error
        );


        return res
            .status(404)
            .json({
                message: error.message
            });
    }
};


// ======================================================
// BUSCAR TODOS
// ======================================================

export const getAllProducts = async (req, res) => {

    try {

        const page =
            Number(req.query.page ?? 0);


        const limit =
            Number(req.query.limit ?? 10);


        const products =
            await service.getAllProducts(
                page,
                limit
            );


        return res
            .status(200)
            .json(products);

    } catch (error) {

        console.error(
            "Erro ao buscar produtos:",
            error
        );


        return res
            .status(500)
            .json({
                message: error.message
            });
    }
};


// ======================================================
// ATUALIZAR
// ======================================================

export const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;


        const product =
            await service.updateProduct(
                id,
                req.body,
                req.file
            );


        return res
            .status(200)
            .json(product);

    } catch (error) {

        console.error(
            "Erro ao atualizar produto:",
            error
        );


        return res
            .status(400)
            .json({
                message: error.message
            });
    }
};


// ======================================================
// DELETAR
// ======================================================

export const deleteProduct = async (req, res) => {

    try {

        const { id } = req.params;


        const result =
            await service.deleteProduct(id);


        return res
            .status(200)
            .json(result);

    } catch (error) {

        console.error(
            "Erro ao deletar produto:",
            error
        );


        return res
            .status(404)
            .json({
                message: error.message
            });
    }
};
