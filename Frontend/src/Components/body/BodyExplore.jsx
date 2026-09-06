
import React, { useEffect, useState } from "react";

import "./BodyExplore.css";

import body from "./body.jpg";

const BodyExplore = () => {

  const text = "Explore our favorite products here";

  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {

    let timer;

    // ==========================================
    // ESCREVENDO
    // ==========================================

    if (!isDeleting && index < text.length) {

      timer = setTimeout(() => {

        setDisplayText(
          text.substring(0, index + 1)
        );

        setIndex(index + 1);

      }, 80);

    }

    // ==========================================
    // ESPERA QUANDO TERMINAR
    // ==========================================

    else if (
      !isDeleting &&
      index === text.length
    ) {

      timer = setTimeout(() => {

        setIsDeleting(true);

      }, 2000);

    }

    // ==========================================
    // APAGANDO
    // ==========================================

    else if (
      isDeleting &&
      index > 0
    ) {

      timer = setTimeout(() => {

        setDisplayText(
          text.substring(0, index - 1)
        );

        setIndex(index - 1);

      }, 40);

    }

    // ==========================================
    // COMEÇAR NOVAMENTE
    // ==========================================

    else if (
      isDeleting &&
      index === 0
    ) {

      timer = setTimeout(() => {

        setIsDeleting(false);

      }, 500);

    }

    return () => clearTimeout(timer);

  }, [index, isDeleting, text]);


  return (

    <div className="body-explore">

      {/* =====================================
          IMAGEM À ESQUERDA
      ====================================== */}

      <div className="body-explore-image">

        <img
          src={body}
          alt="Produtos"
        />

      </div>


      {/* =====================================
          TEXTO À DIREITA
      ====================================== */}

      <div className="body-explore-contents">

        <h2>

          {displayText}

          <span className="cursor">
            |
          </span>

        </h2>


        <p>
          Discover a collection of amazing products
          carefully selected for you. Find your favorite
          style, explore new possibilities and enjoy a
          shopping experience made for you.
        </p>


        <button>
          Explore Products
        </button>

      </div>

    </div>

  );

};

export default BodyExplore;
