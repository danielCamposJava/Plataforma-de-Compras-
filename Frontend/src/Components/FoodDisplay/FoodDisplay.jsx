import React, { useContext } from "react";
import "./FoodDisplay.css";

import { StoreContext } from "../../Content/StoreContent";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = () => {
    const { foodList } = useContext(StoreContext);

    // Garantir que foodList seja um array
    const foods = Array.isArray(foodList)
        ? foodList
        : [];

    console.log(
        "FoodDisplay - produtos recebidos:",
        foods
    );

    return (
        <section
            className="food-display"
            id="food-display"
        >
            <div className="food-display-header">
                <div>
                    <h2>Todos os Produtos</h2>

                    <p>
                        Encontre os melhores produtos
                        para você
                    </p>
                </div>

                <span className="food-display-count">
                    {foods.length} produtos
                </span>
            </div>

            {foods.length === 0 ? (
                <div className="food-display-empty">
                    <h3>Nenhum produto encontrado</h3>

                    <p>
                        Não encontramos produtos
                        disponíveis no momento.
                    </p>
                </div>
            ) : (
                <div className="food-display-list">
                    {foods.map((item) => {
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
                    })}
                </div>
            )}
        </section>
    );
};

export default FoodDisplay;