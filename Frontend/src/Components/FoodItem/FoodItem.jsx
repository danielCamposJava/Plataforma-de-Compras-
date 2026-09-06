
import React, { useContext } from "react";

import "./FoodItem.css";

import { assets } from "../../assets/frontend_assets/assets";

import { StoreContext } from "../../Content/StoreContent";

import { Link } from "react-router-dom";

const FoodItem = ({
    id,
    name,
    price,
    description,
    image
}) => {

    const {
        cartItems = {},
        addToCart,
        removeFromCart
    } = useContext(StoreContext);

    const itemCount = cartItems[id] || 0;

    // =========================================================
    // URL DA IMAGEM DO PRODUTO
    // =========================================================

    const imageUrl = image
        ? `http://localhost:4000/${image}`
        : assets.default_image;

    console.log("Produto:", name);
    console.log("Imagem recebida:", image);
    console.log("URL da imagem:", imageUrl);

    return (

        <div className="food-item">

            <div className="food-item-img-container">

                <img
                    className="food-item-image"
                    src={imageUrl}
                    onError={(e) => {

                        console.error(
                            "Imagem do produto não encontrada:",
                            e.currentTarget.src
                        );

                        e.currentTarget.onerror = null;

                        e.currentTarget.src =
                            assets.default_image;
                    }}
                    alt={`${name} image`}
                />

                {itemCount > 0 && (

                    <div className="food-item-counter">

                        <img
                            onClick={() =>
                                removeFromCart(id)
                            }
                            src={assets.remove_icon_red}
                            alt="Remove from cart"
                            className="remove-icon"
                        />

                        <p>{itemCount}</p>

                        <img
                            onClick={() =>
                                addToCart(id)
                            }
                            src={assets.add_icon_green}
                            alt="Add more"
                        />

                    </div>

                )}

            </div>

            <div className="food-item-info">

                <div className="food-item-name-rating">

                    <p>{name}</p>

                    <img
                        src={assets.rating_starts}
                        alt="Rating stars"
                    />

                </div>

                <p className="food-item-desc">
                    {description}
                </p>

                <p className="food-item-price">
                    ${price}
                </p>

                <Link to={`/product/${id}`}>

                    <button className="details-button">
                        Olhar a comida
                    </button>

                </Link>

            </div>

        </div>
    );
};

export default FoodItem;

