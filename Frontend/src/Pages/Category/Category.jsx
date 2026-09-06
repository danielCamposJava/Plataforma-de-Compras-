
import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./Category.css";

import { StoreContext } from "../../Content/StoreContent";
import FoodItem from "../../components/FoodItem/FoodItem";

const Category = () => {

    const { category } = useParams();
    const navigate = useNavigate();

    const { foodList } = useContext(StoreContext);

    const foods = Array.isArray(foodList)
        ? foodList
        : [];

    // =========================================================
    // FILTRAR PRODUTOS DA CATEGORIA
    // =========================================================

    const categoryProducts = foods.filter((item) => {

        const productCategory =
            typeof item.category === "string"
                ? item.category
                : item.category?.name;

        return (
            String(productCategory || "")
                .trim()
                .toLowerCase() ===
            String(category || "")
                .trim()
                .toLowerCase()
        );
    });

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="category-page">

            <div className="category-page-header">

                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    ← Voltar
                </button>

                <div>
                    <h1>{category}</h1>

                    <p>
                        {categoryProducts.length} produtos encontrados
                    </p>
                </div>

            </div>

            <div className="category-products">

                {categoryProducts.length === 0 ? (

                    <p className="empty-category">
                        Nenhum produto encontrado
                        nesta categoria.
                    </p>

                ) : (

                    categoryProducts.map((item) => {

                        const productId =
                            item.id ?? item._id;

                        return (
                            <FoodItem
                                key={productId}
                                id={productId}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    })
                )}

            </div>

        </div>
    );
};

export default Category;
