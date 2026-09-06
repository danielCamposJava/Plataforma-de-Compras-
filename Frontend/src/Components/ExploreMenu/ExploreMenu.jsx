
import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./ExploreMenu.css";

import {
    FiHome,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";

import { StoreContext } from "../../Content/StoreContent";

const ExploreMenu = ({
    category,
    setCategory
}) => {

    const carouselRef = useRef(null);
    const navigate = useNavigate();

    const {
        categories,
        fetchCategories
    } = useContext(StoreContext);

    // ==================================================
    // BUSCAR CATEGORIAS
    // ==================================================

    useEffect(() => {
        fetchCategories();
    }, []);

    // ==================================================
    // CATEGORIA SALVA
    // ==================================================

    useEffect(() => {

        const savedCategory =
            localStorage.getItem("selectedCategory");

        if (savedCategory) {
            setCategory(savedCategory);
        }

    }, [setCategory]);

    // ==================================================
    // SELECIONAR CATEGORIA
    // ==================================================

    const handleCategoryClick = (catTitle) => {

        // HOME / TODOS
        if (catTitle === "Home") {

            setCategory("All");

            localStorage.setItem(
                "selectedCategory",
                "All"
            );

            navigate("/");

            return;
        }

        // CATEGORIA
        setCategory(catTitle);

        localStorage.setItem(
            "selectedCategory",
            catTitle
        );

        // IR PARA PÁGINA DA CATEGORIA
        navigate(
            `/categoria/${encodeURIComponent(catTitle)}`
        );
    };

    // ==================================================
    // SCROLL ESQUERDA
    // ==================================================

    const scrollLeft = () => {

        if (carouselRef.current) {

            carouselRef.current.scrollBy({
                left: -280,
                behavior: "smooth"
            });
        }
    };

    // ==================================================
    // SCROLL DIREITA
    // ==================================================

    const scrollRight = () => {

        if (carouselRef.current) {

            carouselRef.current.scrollBy({
                left: 280,
                behavior: "smooth"
            });
        }
    };

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <section
            className="explore-menu"
            id="explore-menu"
        >

            <div className="explore-menu-header">

                <div>

                    <h2>
                        Explore Categories
                    </h2>

                    <p>
                        Encontre o estilo perfeito para você
                    </p>

                </div>

            </div>

            <div className="carousel-container">

                {/* SETA ESQUERDA */}

                <button
                    className="arrow left"
                    onClick={scrollLeft}
                    aria-label="Categorias anteriores"
                >
                    <FiChevronLeft />
                </button>

                {/* CATEGORIAS */}

                <div
                    className="explore-menu-list"
                    ref={carouselRef}
                >

                    {/* TODOS */}

                    <div
                        onClick={() =>
                            handleCategoryClick("Home")
                        }
                        className={`explore-menu-list-item ${
                            category === "All"
                                ? "selected"
                                : ""
                        }`}
                    >

                        <div className="category-image home-icon">

                            <FiHome />

                        </div>

                        <p>
                            Todos
                        </p>

                    </div>

                    {/* CATEGORIAS */}

                    {Array.isArray(categories) &&
                        categories.map((cat) => (

                            <div
                                key={cat.id ?? cat._id}
                                onClick={() =>
                                    handleCategoryClick(
                                        cat.title
                                    )
                                }
                                className={`explore-menu-list-item ${
                                    category === cat.title
                                        ? "selected"
                                        : ""
                                }`}
                            >

                                <div className="category-image">

                                    <img
                                        src={
                                            cat.image
                                                ? `http://localhost:4000/uploads/${cat.image}`
                                                : "/assets/default.png"
                                        }
                                        alt={cat.title}
                                        onError={(e) => {

                                            console.error(
                                                "Imagem não encontrada:",
                                                e.currentTarget.src
                                            );

                                            e.currentTarget.onerror = null;

                                            e.currentTarget.src =
                                                "/assets/default.png";
                                        }}
                                    />

                                </div>

                                <p>
                                    {cat.title}
                                </p>

                            </div>

                        ))
                    }

                </div>

                {/* SETA DIREITA */}

                <button
                    className="arrow right"
                    onClick={scrollRight}
                    aria-label="Próximas categorias"
                >
                    <FiChevronRight />
                </button>

            </div>

        </section>
    );
};

export default ExploreMenu;
