import React, {
    useState,
    useContext,
    useEffect
} from "react";

import "./NavBar.css";

import { assets } from "../../assets/frontend_assets/assets";

import { useNavigate } from "react-router-dom";

import { StoreContext } from "../../Content/StoreContent";

import {
    FaBars,
    FaTimes,
    FaShoppingCart,
    FaSearch
} from "react-icons/fa";


const NavBar = ({ setShowLogin }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const {
        foodList,
        getTotalCartAmount,
        user,
        setUser
    } = useContext(StoreContext);


    /* =====================================================
       PESQUISA
    ===================================================== */

    const filteredProducts = search.trim()
        ? (foodList || []).filter((product) => {

            const term = search.toLowerCase().trim();

            const name =
                product.name?.toLowerCase() || "";

            const description =
                product.description?.toLowerCase() || "";

            const category =
                typeof product.category === "string"
                    ? product.category.toLowerCase()
                    : product.category?.name?.toLowerCase() || "";

            return (
                name.includes(term) ||
                description.includes(term) ||
                category.includes(term)
            );
        })
        : [];


    /* =====================================================
       MENU
    ===================================================== */

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        setUser(null);

        setIsMenuOpen(false);

        navigate("/");
    };


    /* =====================================================
       FECHAR MENU AO REDIMENSIONAR
    ===================================================== */

    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };

    }, []);


    /* =====================================================
       BLOQUEAR SCROLL NO MOBILE
    ===================================================== */

    useEffect(() => {

        document.body.style.overflow =
            isMenuOpen ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };

    }, [isMenuOpen]);


    /* =====================================================
       ABRIR PRODUTO
    ===================================================== */

    const handleProductClick = (product) => {

        setSearch("");

        setIsMenuOpen(false);

        navigate(`/product/${product._id || product.id}`);
    };


    return (
        <>
            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">

                {/* LOGO */}

                <img
                    src={assets.logo}
                    alt="Logo"
                    className="logo"
                    onClick={() => {
                        setSearch("");
                        navigate("/");
                    }}
                />


                {/* =================================================
                    PESQUISA
                ================================================= */}

                <div className="navbar-search">

                    <input
                        type="text"
                        placeholder="Pesquisar produtos..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button
                        type="button"
                        aria-label="Pesquisar"
                    >
                        <FaSearch />
                    </button>

                </div>


                {/* =================================================
                    DIREITA
                ================================================= */}

                <div className="navbar-right">

                    {/* CARRINHO */}

                    <div
                        className="navbar-cart"
                        onClick={() =>
                            navigate("/cart")
                        }
                    >

                        <FaShoppingCart
                            className="cart-icon"
                        />

                        {getTotalCartAmount() > 0 && (
                            <span className="cart-dot"></span>
                        )}

                    </div>


                    {/* USUÁRIO */}

                    {user ? (

                        <div className="navbar-user">

                            <div className="user-info">

                                <span className="user-name">
                                    {user.name?.split(" ")[0]}
                                </span>

                                <span
                                    className="user-status"
                                    title="Online"
                                ></span>

                            </div>

                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    ) : (

                        <button
                            className="navbar-button"
                            onClick={() =>
                                setShowLogin(true)
                            }
                        >
                            Sign In
                        </button>

                    )}


                    {/* MENU MOBILE */}

                    <button
                        className="menu-icon"
                        onClick={toggleMenu}
                        aria-label="Abrir menu"
                    >

                        {isMenuOpen ? (
                            <FaTimes />
                        ) : (
                            <FaBars />
                        )}

                    </button>

                </div>

            </header>


            {/* =================================================
                RESULTADOS DA PESQUISA
            ================================================= */}

            {search.trim() && (

                <section className="search-results">

                    <div className="search-results-container">

                        <div className="search-results-header">

                            <h3>
                                Resultados para:
                                <strong>
                                    {" "}
                                    "{search}"
                                </strong>
                            </h3>

                            <span>
                                {filteredProducts.length} produto
                                {filteredProducts.length !== 1
                                    ? "s"
                                    : ""}
                            </span>

                        </div>


                        {filteredProducts.length > 0 ? (

                            <div className="search-products-grid">

                                {filteredProducts.map(
                                    (product) => (

                                        <article
                                            className="search-product-card"
                                            key={
                                                product._id ||
                                                product.id
                                            }
                                            onClick={() =>
                                                handleProductClick(
                                                    product
                                                )
                                            }
                                        >

                                            <div className="search-product-image">

                                                <img
                                                    src={
                                                        product.image ||
                                                        product.imageUrl ||
                                                        "/placeholder.png"
                                                    }
                                                    alt={
                                                        product.name
                                                    }
                                                />

                                            </div>


                                            <div className="search-product-info">

                                                <h4>
                                                    {product.name}
                                                </h4>

                                                {product.description && (

                                                    <p>
                                                        {
                                                            product.description
                                                        }
                                                    </p>

                                                )}

                                                <div className="search-product-bottom">

                                                    <span className="search-product-price">
                                                        R${" "}
                                                        {Number(
                                                            product.price || 0
                                                        ).toFixed(2)}
                                                    </span>

                                                    <span className="view-product">
                                                        Ver produto
                                                    </span>

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="no-search-results">

                                <FaSearch />

                                <h4>
                                    Nenhum produto encontrado
                                </h4>

                                <p>
                                    Tente pesquisar por outro
                                    nome, categoria ou produto.
                                </p>

                            </div>

                        )}

                    </div>

                </section>

            )}


            {/* =================================================
                MENU MOBILE
            ================================================= */}

            <aside
                className={`mobile-menu ${
                    isMenuOpen ? "active" : ""
                }`}
            >

                <button
                    onClick={() => {
                        navigate("/");
                        setIsMenuOpen(false);
                    }}
                >
                    Home
                </button>


                <button
                    onClick={() => {
                        navigate("/cart");
                        setIsMenuOpen(false);
                    }}
                >
                    Carrinho
                </button>


                {user ? (

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                ) : (

                    <button
                        onClick={() => {
                            setShowLogin(true);
                            setIsMenuOpen(false);
                        }}
                    >
                        Sign In
                    </button>

                )}

            </aside>

        </>
    );
};

export default NavBar;