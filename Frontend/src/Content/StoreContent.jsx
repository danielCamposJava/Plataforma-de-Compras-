
import { createContext, useEffect, useState } from "react";

// ============================================================
// ACOMPANHAMENTOS
// ============================================================

const acompanhamento_principal = [
    { name: "Vinagrete", preco: 2.5 },
    { name: "Vatapá", preco: 3 },
    { name: "Maionese", preco: 2.8 },
    { name: "Farofa", preco: 2 },
];

const acompanhamento_refri = [
    { name: "Refrigerante 300 ml", preco: 3 },
    { name: "Refrigerante 1l", preco: 5 },
    { name: "Refrigerante 2l", preco: 7 },
];

const acompanhamento_arroz = [
    { name: "Arroz Branco", preco: 4 },
    { name: "Arroz com brócolis", preco: 5 },
    { name: "Arroz Carreteiro", preco: 6 },
    { name: "Arroz Tropeiro", preco: 5.5 },
];

const acompanhamento_batata = [
    { name: "Batata média 1 pessoa", preco: 3.5 },
    { name: "Batata grande 2 pessoas", preco: 6.5 },
    { name: "Batata família", preco: 8.5 },
];

// ============================================================
// CONTEXT
// ============================================================

export const StoreContext = createContext(null);

// ============================================================
// PROVIDER
// ============================================================

const StoreContextProvider = ({ children }) => {

    // ========================================================
    // ESTADOS
    // ========================================================

    const [cartItems, setCartItems] = useState([]);

    const [foodList, setFoodList] = useState([]);

    const [categories, setCategories] = useState([]);

    const [user, setUser] = useState(null);

    // Paginação
    const [page, setPage] = useState(0);

    // ALTERADO: antes era 10
    const [limit, setLimit] = useState(1000);

    const [totalCount, setTotalCount] = useState(0);

    const [loadingProducts, setLoadingProducts] = useState(false);

    const [loadingCategories, setLoadingCategories] = useState(false);

    // ========================================================
    // AUTENTICAÇÃO
    // ========================================================

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    // ========================================================
    // BUSCAR PRODUTOS
    // ========================================================

    const fetchFoodList = async (
        currentPage = page,
        currentLimit = limit
    ) => {

        try {

            setLoadingProducts(true);

            const url =
                `http://localhost:4000/api/foods?page=${currentPage}&limit=${currentLimit}`;

            console.log(
                "================================="
            );

            console.log(
                "BUSCANDO PRODUTOS:"
            );

            console.log(url);

            console.log(
                "================================="
            );

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(
                "Status da API:",
                response.status
            );

            if (!response.ok) {
                throw new Error(
                    `Erro HTTP: ${response.status}`
                );
            }

            const result = await response.json();

            console.log(
                "Resposta completa da API:",
                result
            );

            // ==================================================
            // API RETORNANDO ARRAY
            // ==================================================

            if (Array.isArray(result)) {

                console.log(
                    "API retornou array"
                );

                console.log(
                    "Total recebido:",
                    result.length
                );

                setFoodList(result);

                setTotalCount(result.length);

                return result;
            }

            // ==================================================
            // API RETORNANDO OBJETO PAGINADO
            // ==================================================

            if (
                result &&
                Array.isArray(result.data)
            ) {

                console.log(
                    "Produtos recebidos:",
                    result.data
                );

                console.log(
                    "Quantidade recebida:",
                    result.data.length
                );

                console.log(
                    "Total de produtos:",
                    result.totalCount
                );

                setFoodList(result.data);

                setTotalCount(
                    Number(result.totalCount) ||
                    result.data.length
                );

                return result.data;
            }

            // ==================================================
            // RESPOSTA INVÁLIDA
            // ==================================================

            console.warn(
                "Formato inesperado da API:",
                result
            );

            setFoodList([]);

            setTotalCount(0);

            return [];

        } catch (error) {

            console.error(
                "ERRO AO BUSCAR PRODUTOS:",
                error
            );

            setFoodList([]);

            setTotalCount(0);

            return [];

        } finally {

            setLoadingProducts(false);
        }
    };

    // ========================================================
    // BUSCAR CATEGORIAS
    // ========================================================

    const fetchCategories = async () => {

        try {

            setLoadingCategories(true);

            const response = await fetch(
                "http://localhost:4000/category/get-category",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erro HTTP: ${response.status}`
                );
            }

            const result =
                await response.json();

            console.log(
                "Categorias recebidas:",
                result
            );

            if (
                result &&
                Array.isArray(result.categories)
            ) {

                setCategories(
                    result.categories
                );

            } else if (
                Array.isArray(result)
            ) {

                setCategories(result);

            } else {

                console.warn(
                    "Formato de categorias inesperado:",
                    result
                );

                setCategories([]);
            }

        } catch (error) {

            console.error(
                "Erro ao buscar categorias:",
                error
            );

            setCategories([]);

        } finally {

            setLoadingCategories(false);
        }
    };

    // ========================================================
    // CARREGAMENTO INICIAL
    // ========================================================

    useEffect(() => {

        // ALTERADO: busca até 1000 produtos
        fetchFoodList(0, 1000);

        fetchCategories();

    }, []);

    // ========================================================
    // PAGINAÇÃO
    // ========================================================

    useEffect(() => {

        if (page === 0) {
            return;
        }

        fetchFoodList(page, limit);

    }, [page, limit]);

    // ========================================================
    // ATUALIZAR PRODUTOS
    // ========================================================

    const refreshFoodList = async () => {

        await fetchFoodList(
            page,
            limit
        );
    };

    // ========================================================
    // ADICIONAR AO CARRINHO
    // ========================================================

    const addToCart = (cartItem) => {

        if (!cartItem) {

            console.warn(
                "Produto inválido:",
                cartItem
            );

            return;
        }

        const productId =
            cartItem.id ??
            cartItem._id;

        if (!productId) {

            console.warn(
                "Produto sem ID:",
                cartItem
            );

            return;
        }

        const productPrice =
            cartItem.price ??
            cartItem.preco;

        if (
            productPrice === undefined ||
            productPrice === null
        ) {

            console.warn(
                "Produto sem preço:",
                cartItem
            );

            return;
        }

        const existingItemIndex =
            cartItems.findIndex((item) => {

                const existingId =
                    item.product?.id ??
                    item.product?._id;

                return (
                    String(existingId) ===
                    String(productId)
                );
            });

        // ====================================================
        // PRODUTO EXISTENTE
        // ====================================================

        if (existingItemIndex !== -1) {

            setCartItems((previousItems) => {

                const updatedItems =
                    [...previousItems];

                updatedItems[
                    existingItemIndex
                ] = {

                    ...updatedItems[
                        existingItemIndex
                    ],

                    quantity:
                        updatedItems[
                            existingItemIndex
                        ].quantity + 1,

                    acompanhamentos:
                        cartItem.extras || [],
                };

                return updatedItems;
            });

            return;
        }

        // ====================================================
        // NOVO PRODUTO
        // ====================================================

        setCartItems((previousItems) => [

            ...previousItems,

            {

                product: {

                    ...cartItem,

                    id: productId,

                    _id: productId,

                    price: productPrice,
                },

                quantity: 1,

                acompanhamentos:
                    cartItem.extras || [],
            },
        ]);
    };

    // ========================================================
    // REMOVER DO CARRINHO
    // ========================================================

    const removeFromCart = (productId) => {

        if (!productId) {

            console.warn(
                "productId inválido:",
                productId
            );

            return;
        }

        setCartItems((previousItems) => {

            return previousItems.filter(
                (item) => {

                    const itemId =
                        item.product?.id ??
                        item.product?._id;

                    return (
                        String(itemId) !==
                        String(productId)
                    );
                }
            );
        });
    };

    // ========================================================
    // LIMPAR CARRINHO
    // ========================================================

    const clearCart = () => {

        setCartItems([]);
    };

    // ========================================================
    // PREÇO DO ACOMPANHAMENTO
    // ========================================================

    const getAcompanhamentoPrice = (acomp) => {

        if (!acomp || !acomp.name) {
            return 0;
        }

        const allAcompanhamentos = [

            ...acompanhamento_principal,

            ...acompanhamento_refri,

            ...acompanhamento_arroz,

            ...acompanhamento_batata,
        ];

        const selectedAcompanhamento =
            allAcompanhamentos.find(
                (item) =>
                    item.name === acomp.name
            );

        return selectedAcompanhamento
            ? selectedAcompanhamento.preco
            : 0;
    };

    // ========================================================
    // TOTAL DO CARRINHO
    // ========================================================

    const getTotalCartAmount = () => {

        let totalAmount = 0;

        cartItems.forEach((item) => {

            const productPrice =
                Number(
                    item.product?.price ??
                    item.product?.preco ??
                    0
                );

            const quantity =
                Number(item.quantity) || 0;

            totalAmount +=
                productPrice * quantity;

            item.acompanhamentos?.forEach(
                (acomp) => {

                    const accompanimentPrice =
                        Number(
                            acomp.price ??
                            acomp.preco ??
                            getAcompanhamentoPrice(
                                acomp
                            )
                        ) || 0;

                    totalAmount +=
                        accompanimentPrice *
                        quantity;
                }
            );
        });

        return totalAmount;
    };

    // ========================================================
    // QUANTIDADE TOTAL
    // ========================================================

    const getTotalCartItems = () => {

        return cartItems.reduce(
            (total, item) =>
                total +
                (Number(item.quantity) || 0),
            0
        );
    };

    // ========================================================
    // DEBUG PRODUTOS
    // ========================================================

    useEffect(() => {

        console.log(
            "================================="
        );

        console.log(
            "FOOD LIST ATUALIZADA"
        );

        console.log(
            "Quantidade:",
            foodList.length
        );

        console.log(
            "Produtos:",
            foodList
        );

        console.log(
            "================================="
        );

    }, [foodList]);

    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const contextValue = {

        // Produtos
        food_list: foodList,
        foodList,
        setFoodList,
        fetchFoodList,
        refreshFoodList,

        // Paginação
        page,
        setPage,
        limit,
        setLimit,
        totalCount,
        setTotalCount,

        // Loading
        loadingProducts,
        loadingCategories,

        // Categorias
        categories,
        setCategories,
        fetchCategories,

        // Carrinho
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,

        // Valores
        getTotalCartAmount,
        getTotalCartItems,
        getAcompanhamentoPrice,

        // Usuário
        user,
        setUser,
        login,
        logout,
    };

    // ========================================================
    // PROVIDER
    // ========================================================

    return (
        <StoreContext.Provider
            value={contextValue}
        >
            {children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
