import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Content/StoreContent";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
    const { foodList } = useContext(StoreContext);

    // Garantir que seja um array
    const foods = Array.isArray(foodList)
        ? foodList
        : [];

    console.log(
        "FoodDisplay - produtos recebidos:",
        foods
    );

    return (
        <div
            className="food-display"
            id="food-display"
        >
            <h2>Todos os Produtos</h2>

            <div className="food-display-list">
                {foods.length === 0 ? (
                    <p>
                        Nenhum produto encontrado.
                    </p>
                ) : (
                    foods.map((item) => {
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

export default FoodDisplay;