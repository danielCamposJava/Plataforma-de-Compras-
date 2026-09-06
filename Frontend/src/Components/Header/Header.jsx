
import React, { useEffect, useState } from 'react';
import './Header.css';
import headerImage from './headerFooter.jpg';

const Header = () => {
  const text = 'Order your favorite products here';

  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    if (!isDeleting && index < text.length) {
      // ESCREVENDO
      timer = setTimeout(() => {
        setDisplayText(text.substring(0, index + 1));
        setIndex(index + 1);
      }, 80);

    } else if (!isDeleting && index === text.length) {
      // ESPERA QUANDO TERMINAR
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);

    } else if (isDeleting && index > 0) {
      // APAGANDO
      timer = setTimeout(() => {
        setDisplayText(text.substring(0, index - 1));
        setIndex(index - 1);
      }, 40);

    } else if (isDeleting && index === 0) {
      // COMEÇA NOVAMENTE
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [index, isDeleting, text]);

  return (
    <div className="header">

      {/* FOTO À ESQUERDA */}
      <div className="header-image">
        <img src={headerImage} alt="Produtos" />
      </div>

      {/* TEXTO À DIREITA */}
      <div className="header-contents">

        <h2>
          {displayText}
          <span className="cursor">|</span>
        </h2>

        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our mission
          is to satisfy cravings and elevate your dining experience, one
          delicious meal at a time.
        </p>

        <button>View Products   </button>

      </div>

    </div>
  );
};

export default Header;

