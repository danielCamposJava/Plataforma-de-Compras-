
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { StoreContext } from '../../Content/StoreContent';
import './PagesDetails.css';

const API_URL = 'http://localhost:4000';

const PagesDetails = () => {
  const { addToCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/foods/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          'Erro ao buscar produto:',
          error.response?.data || error.message
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(price) || 0);

  const getImageUrl = (image) => {
    if (!image) {
      return '/default-image.jpg';
    }

    if (image.startsWith('http')) {
      return image;
    }

    return `${API_URL}/${image}`;
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      image: getImageUrl(product.image),
      price: Number(product.price) || 0,
      quantity: 1,
    });

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/Cart');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="product-details">

      {/* RETÂNGULO COM IMAGEM E INFORMAÇÕES */}
      <div className="product-card">

        {/* IMAGEM À ESQUERDA */}
        <div className="product-image-container">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="product-details-image"
          />
        </div>

        {/* INFORMAÇÕES À DIREITA */}
        <div className="product-info">

          <h1>Detalhes da Compra</h1>

          <p className="product-name">
            {product.name}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <p className="product-category">
            Categoria: {product.category}
          </p>

          <div className="product-price">
            <strong>Preço:</strong>{' '}
            {formatPrice(product.price)}
          </div>

        </div>

      </div>

      {/* BOTÃO À ESQUERDA */}
      <div className="product-button-container">
        <button
          className="add-to-cart-button"
          onClick={handleAddToCart}
        >
          Adicionar ao Carrinho
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal">

          <div className="modal-content">

            <h2>Produto Adicionado ao Carrinho</h2>

            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="modal-image"
            />

            <p>
              <strong>Produto:</strong>{' '}
              {product.name}
            </p>

            <p>
              <strong>Categoria:</strong>{' '}
              {product.category}
            </p>

            <p>
              <strong>Preço:</strong>{' '}
              {formatPrice(product.price)}
            </p>

            <div className="modal-buttons">

              <button onClick={handleCloseModal}>
                Ir para o Carrinho
              </button>

              <button
                onClick={() => setShowModal(false)}
              >
                Continuar Comprando
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default PagesDetails;

