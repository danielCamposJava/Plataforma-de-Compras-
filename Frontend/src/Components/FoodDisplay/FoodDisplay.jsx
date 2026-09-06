
import React, { useContext } from "react";

import "./FoodDisplay.css";

import { StoreContext } from "../../Content/StoreContent";

import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {

    const { foodList } = useContext(StoreContext);

    // =========================================================
    // GARANTIR QUE FOODLIST SEJA UM ARRAY
    // =========================================================

    const foods = Array.isArray(foodList)
        ? foodList
        : [];

    console.log(
        "FoodDisplay - produtos recebidos:",
        foods
    );

    console.log(
        "FoodDisplay - categoria selecionada:",
        category
    );

    // =========================================================
    // FILTRAR PRODUTOS
    // =========================================================

    const filteredFoods = foods.filter((item) => {

        if (!category || category === "All") {
            return true;
        }

        // =====================================================
        // PEGAR CATEGORIA DO PRODUTO
        // =====================================================

        const productCategory =
            typeof item.category === "string"
                ? item.category
                : item.category?.name;

        // =====================================================
        // COMPARAR CATEGORIAS
        // =====================================================

        return (
            String(productCategory || "")
                .trim()
                .toLowerCase() ===
            String(category || "")
                .trim()
                .toLowerCase()
        );
    });

    console.log(
        "FoodDisplay - produtos filtrados:",
        filteredFoods
    );

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="food-display"
            id="food-display"
        >

            <h2>Menu Principal</h2>

            <div className="food-display-list">

                {foods.length === 0 ? (

                    <p>
                        Nenhum produto encontrado.
                    </p>

                ) : filteredFoods.length === 0 ? (

                    <p>
                        Nenhum produto encontrado
                        para esta categoria.
                    </p>

                ) : (

                    filteredFoods.map((item) => {

                        // =================================================
                        // ACEITAR id OU _id
                        // =================================================

                        const productId =
                            item.id ?? item._id;

                        console.log(
                            "Produto:",
                            item.name,
                            "Imagem:",
                            item.image
                        );

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

export default FoodDisplay;

