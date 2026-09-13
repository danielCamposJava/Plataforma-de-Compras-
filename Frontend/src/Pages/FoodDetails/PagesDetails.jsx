import React, { useContext, useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import { StoreContext } from "../../Content/StoreContent";

import "./PagesDetails.css";

const API_URL = "http://localhost:4000";

const PagesDetails = () => {

    const { addToCart } = useContext(StoreContext);

    const navigate = useNavigate();

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);


    // =========================================================
    // BUSCAR PRODUTO ATUAL
    // =========================================================

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    `${API_URL}/api/foods/${id}`
                );

                setProduct(response.data);

            } catch (error) {

                console.error(
                    "Erro ao buscar produto:",
                    error.response?.data || error.message
                );

                setProduct(null);

            } finally {

                setLoading(false);

            }

        };

        if (id) {
            fetchProduct();
        }

    }, [id]);


    // =========================================================
    // BUSCAR TODOS OS PRODUTOS
    // =========================================================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await axios.get(
                    `${API_URL}/api/foods`
                );

                const data = response.data;

                const productList = Array.isArray(data)
                    ? data
                    : data?.data || [];

                setProducts(productList);

            } catch (error) {

                console.error(
                    "Erro ao buscar produtos:",
                    error.response?.data || error.message
                );

                setProducts([]);

            }

        };

        fetchProducts();

    }, []);


    // =========================================================
    // FORMATAR PREÇO
    // =========================================================

    const formatPrice = (price) => {

        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(price) || 0);

    };


    // =========================================================
    // URL DA IMAGEM
    // =========================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "/default-image.jpg";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const cleanImage = image.replace(/^\/+/, "");

        return `${API_URL}/${cleanImage}`;

    };


    // =========================================================
    // ADICIONAR AO CARRINHO
    // =========================================================

    const handleAddToCart = () => {

        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            image: getImageUrl(product.image),
            price: Number(product.price) || 0,
            quantity: 1,
        });

        setShowModal(true);

    };


    // =========================================================
    // FECHAR MODAL
    // =========================================================

    const handleCloseModal = () => {

        setShowModal(false);

        navigate("/Cart");

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="loading-container">
                <p>Carregando produto...</p>
            </div>
        );

    }


    // =========================================================
    // PRODUTO NÃO ENCONTRADO
    // =========================================================

    if (!product) {

        return (
            <div className="error-container">
                <p>Produto não encontrado.</p>
            </div>
        );

    }


    // =========================================================
    // CATEGORIA DO PRODUTO ATUAL
    // =========================================================

    const currentCategory =
        typeof product.category === "object"
            ? product.category?.name
            : product.category;


    // =========================================================
    // PRODUTOS DA MESMA CATEGORIA
    // =========================================================

    const relatedProducts = products
        .filter((item) => {

            const itemId =
                item.id ?? item._id;

            const currentProductId =
                product.id ?? product._id;


            // Não mostrar o próprio produto
            if (
                String(itemId) ===
                String(currentProductId)
            ) {
                return false;
            }


            const itemCategory =
                typeof item.category === "object"
                    ? item.category?.name
                    : item.category;


            // Somente produtos da mesma categoria
            return (
                String(itemCategory || "")
                    .trim()
                    .toLowerCase()
                ===
                String(currentCategory || "")
                    .trim()
                    .toLowerCase()
            );

        })
        .slice(0, 4);


    // =========================================================
    // OUTROS PRODUTOS
    //
    // Produtos de outras categorias
    // =========================================================

    const otherProducts = products
        .filter((item) => {

            const itemId =
                item.id ?? item._id;

            const currentProductId =
                product.id ?? product._id;


            // Não mostrar o produto atual
            if (
                String(itemId) ===
                String(currentProductId)
            ) {
                return false;
            }


            const itemCategory =
                typeof item.category === "object"
                    ? item.category?.name
                    : item.category;


            // Somente categorias diferentes
            return (
                String(itemCategory || "")
                    .trim()
                    .toLowerCase()
                !==
                String(currentCategory || "")
                    .trim()
                    .toLowerCase()
            );

        })
        .slice(0, 8);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="product-details">


            {/* =================================================
                PRODUTO PRINCIPAL + RELACIONADOS
            ================================================= */}

            <div className="product-details-layout">


                {/* =================================================
                    PRODUTO PRINCIPAL
                ================================================= */}

                <div className="product-card">


                    {/* IMAGEM DO PRODUTO */}

                    <div className="product-image-container">

                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="product-details-image"
                            onError={(event) => {

                                event.currentTarget.onerror = null;

                                event.currentTarget.src =
                                    "/default-image.jpg";

                            }}
                        />

                    </div>


                    {/* INFORMAÇÕES DO PRODUTO */}

                    <div className="product-info">

                        <h1>
                            Detalhes da Compra
                        </h1>


                        <p className="product-name">
                            {product.name}
                        </p>


                        <p className="product-description">

                            {product.description ||
                                "Produto de excelente qualidade."}

                        </p>


                        <p className="product-category">

                            Categoria:{" "}

                            {typeof product.category === "object"
                                ? product.category?.name
                                : product.category}

                        </p>


                        <div className="product-price">

                            <strong>
                                Preço:
                            </strong>{" "}

                            {formatPrice(product.price)}

                        </div>


                        {/* BOTÃO */}

                        <div className="product-button-container">

                            <button
                                className="add-to-cart-button"
                                onClick={handleAddToCart}
                            >
                                Adicionar ao Carrinho
                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    PRODUTOS DA MESMA CATEGORIA
                ================================================= */}

                {relatedProducts.length > 0 && (

                    <aside className="related-products-card">

                        <div className="related-products-header">

                            <h2>
                                Produtos relacionados
                            </h2>

                            <p>
                                Outros produtos desta categoria
                            </p>

                        </div>


                        <div className="related-products-list">

                            {relatedProducts.map((item) => {

                                const itemId =
                                    item.id ?? item._id;

                                return (

                                    <article
                                        className="related-product-item"
                                        key={itemId}
                                    >

                                        <div className="related-product-image">

                                            <img
                                                src={getImageUrl(
                                                    item.image
                                                )}
                                                alt={item.name}
                                                onError={(event) => {

                                                    event.currentTarget.onerror =
                                                        null;

                                                    event.currentTarget.src =
                                                        "/default-image.jpg";

                                                }}
                                            />

                                        </div>


                                        <div className="related-product-content">

                                            <h3>
                                                {item.name}
                                            </h3>


                                            <p>
                                                {item.description ||
                                                    "Produto de excelente qualidade."}
                                            </p>


                                            <strong>
                                                {formatPrice(
                                                    item.price
                                                )}
                                            </strong>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/product/${itemId}`
                                                    )
                                                }
                                            >
                                                Ver produto
                                            </button>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>

                    </aside>

                )}

            </div>


            {/* =================================================
                OUTROS PRODUTOS
            ================================================= */}

            {otherProducts.length > 0 && (

                <section className="other-products">


                    {/* CABEÇALHO */}

                    <div className="other-products-header">

                        <h2>
                            Outros produtos
                        </h2>

                        <p>
                            Confira outros itens disponíveis
                        </p>

                    </div>


                    {/* GRID */}

                    <div className="other-products-grid">

                        {otherProducts.map((item) => {

                            const itemId =
                                item.id ?? item._id;

                            return (

                                <article
                                    className="other-product-card"
                                    key={itemId}
                                >


                                    {/* IMAGEM */}

                                    <div className="other-product-image">

                                        <img
                                            src={getImageUrl(
                                                item.image
                                            )}
                                            alt={item.name}
                                            onError={(event) => {

                                                event.currentTarget.onerror =
                                                    null;

                                                event.currentTarget.src =
                                                    "/default-image.jpg";

                                            }}
                                        />

                                    </div>


                                    {/* INFORMAÇÕES */}

                                    <div className="other-product-info">

                                        <h3>
                                            {item.name}
                                        </h3>


                                        <p>
                                            {item.description ||
                                                "Produto de excelente qualidade."}
                                        </p>


                                        <strong>
                                            {formatPrice(
                                                item.price
                                            )}
                                        </strong>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/product/${itemId}`
                                                )
                                            }
                                        >
                                            Ver produto
                                        </button>

                                    </div>

                                </article>

                            );

                        })}

                    </div>

                </section>

            )}


            {/* =================================================
                MODAL
            ================================================= */}

            {showModal && (

                <div className="modal">

                    <div className="modal-content">


                        <h2>
                            Produto Adicionado ao Carrinho
                        </h2>


                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            className="modal-image"
                        />


                        <p>

                            <strong>
                                Produto:
                            </strong>{" "}

                            {product.name}

                        </p>


                        <p>

                            <strong>
                                Categoria:
                            </strong>{" "}

                            {typeof product.category === "object"
                                ? product.category?.name
                                : product.category}

                        </p>


                        <p>

                            <strong>
                                Preço:
                            </strong>{" "}

                            {formatPrice(product.price)}

                        </p>


                        <div className="modal-buttons">

                            <button
                                onClick={handleCloseModal}
                            >
                                Ir para o Carrinho
                            </button>


                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                Continuar Comprando
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default PagesDetails;