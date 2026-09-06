
import React, {
    useEffect,
    useRef,
    useContext
} from "react";

import "./ExploreMenu.css";

import {
    FiMenu,
    FiHome
} from "react-icons/fi";

import {
    StoreContext
} from "../../Content/StoreContent";


const ExploreMenu = ({
    category,
    setCategory
}) => {

    const carouselRef = useRef(null);

    const {
        categories,
        fetchCategories
    } = useContext(StoreContext);


    // ==================================================
    // BUSCAR CATEGORIAS
    // ==================================================

    useEffect(() => {

        fetchCategories();

    }, [fetchCategories]);


    // ==================================================
    // CATEGORIA SALVA
    // ==================================================

    useEffect(() => {

        const savedCategory =
            localStorage.getItem(
                "selectedCategory"
            );

        if (savedCategory) {

            setCategory(savedCategory);

        }

    }, [setCategory]);


    // ==================================================
    // SELECIONAR CATEGORIA
    // ==================================================

    const handleCategoryClick = (catTitle) => {

        const newCategory =
            catTitle === "Home"
                ? "All"
                : catTitle;

        setCategory(newCategory);

        localStorage.setItem(
            "selectedCategory",
            newCategory
        );

    };


    // ==================================================
    // SCROLL
    // ==================================================

    const scrollLeft = () => {

        if (carouselRef.current) {

            carouselRef.current.scrollBy({

                left: -200,

                behavior: "smooth"

            });

        }

    };


    const scrollRight = () => {

        if (carouselRef.current) {

            carouselRef.current.scrollBy({

                left: 200,

                behavior: "smooth"

            });

        }

    };


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div
            className="explore-menu"
            id="explore-menu"
        >

            <div className="explore-menu-header">

                <h1>
                    Explore o Menu
                </h1>

                <FiMenu
                    className="menu-icon"
                />

            </div>


            <p className="explore-menu-text">

                Explore todos os tipos de comidas

            </p>


            <div className="carousel-container">

                <button
                    className="arrow left"
                    onClick={scrollLeft}
                >
                    &lt;
                </button>


                <div
                    className="explore-menu-list"
                    ref={carouselRef}
                >

                    {/* HOME */}

                    <div
                        onClick={() =>
                            handleCategoryClick("Home")
                        }

                        className="explore-menu-list-item"
                    >

                        <FiHome
                            className={`category-icon ${
                                category === "All"
                                    ? "active"
                                    : ""
                            }`}
                        />

                        <p>
                            Home
                        </p>

                    </div>


                    {/* CATEGORIAS */}

                    {Array.isArray(categories) &&
                        categories.map((cat) => (

                            <div
                                key={cat.id}

                                onClick={() =>
                                    handleCategoryClick(
                                        cat.title
                                    )
                                }

                                className="explore-menu-list-item"
                            >

                                <img

                                    className={
                                        category === cat.title
                                            ? "active"
                                            : ""
                                    }

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


                                <p>
                                    {cat.title}
                                </p>

                            </div>

                        ))
                    }

                </div>


                <button
                    className="arrow right"
                    onClick={scrollRight}
                >
                    &gt;
                </button>

            </div>

        </div>

    );

};


export default ExploreMenu;
