
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import NavBarAdmin from '../../Components/NavBarAdmin/NavBarAdmin';
import Sidebar from '../../Components/SidbarAdmin/Sidbar';
import { StoreContext } from '../../Content/StoreContent';

import {
  FiTrash2,
  FiEdit,
  FiBox,
  FiTag,
} from 'react-icons/fi';

import './AdminListProduct.css';

const API_URL = 'http://localhost:4000/api/foods';

const ITEMS_PER_PAGE = 10;

// ======================================================
// COMPONENTE PRINCIPAL
// ======================================================

const AdminListProduct = () => {
  const { fetchFoodList } = useContext(StoreContext);

  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ======================================================
  // ALERT
  // ======================================================

  const showAlert = useCallback((type, message) => {
    setAlert({
      type,
      message,
    });

    setTimeout(() => {
      setAlert({
        type: '',
        message: '',
      });
    }, 3000);
  }, []);

  // ======================================================
  // BUSCAR ALIMENTOS
  // ======================================================

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${API_URL}?page=${page}&limit=${ITEMS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível carregar os alimentos.');
      }

      const result = await response.json();

      setFoods(Array.isArray(result.data) ? result.data : []);
      setTotalItems(Number(result.totalCount) || 0);
    } catch (err) {
      console.error('Erro ao buscar alimentos:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'Erro inesperado ao buscar alimentos.';

      setError(message);
      showAlert('error', message);
    } finally {
      setLoading(false);
    }
  }, [page, showAlert]);

  // ======================================================
  // EFFECT
  // ======================================================

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // ======================================================
  // PAGINAÇÃO
  // ======================================================

  const totalPages = Math.max(
    Math.ceil(totalItems / ITEMS_PER_PAGE),
    1
  );

  const handlePreviousPage = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 0));
  };

  const handleNextPage = () => {
    setPage((currentPage) =>
      Math.min(currentPage + 1, totalPages - 1)
    );
  };

  // ======================================================
  // DELETAR
  // ======================================================

  const handleDelete = async (id) => {
    if (!id) {
      showAlert('error', 'ID do alimento não encontrado.');
      return;
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir este alimento?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Não foi possível excluir o alimento.');
      }

      /*
       * Atualização otimista da lista atual.
       */
      setFoods((currentFoods) =>
        currentFoods.filter((food) => food.id !== id)
      );

      setTotalItems((currentTotal) =>
        Math.max(currentTotal - 1, 0)
      );

      /*
       * Atualiza o contexto global.
       */
      await fetchFoodList();

      /*
       * Se a página ficar vazia depois da exclusão,
       * volta uma página.
       */
      if (foods.length === 1 && page > 0) {
        setPage((currentPage) => currentPage - 1);
      }

      showAlert(
        'success',
        'Alimento excluído com sucesso.'
      );
    } catch (err) {
      console.error('Erro ao excluir alimento:', err);

      showAlert(
        'error',
        'Erro ao excluir o alimento.'
      );
    }
  };

  // ======================================================
  // EDITAR
  // ======================================================

  const handleEdit = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  // ======================================================
  // FECHAR MODAL
  // ======================================================

  const handleCloseModal = () => {
    setSelectedFood(null);
    setIsModalOpen(false);
  };

  // ======================================================
  // SALVAR ALTERAÇÃO
  // ======================================================

  const handleSave = async (updatedFood) => {
    try {
      const formData = new FormData();

      formData.append(
        'name',
        updatedFood.name.trim()
      );

      formData.append(
        'description',
        updatedFood.description.trim()
      );

      formData.append(
        'category',
        updatedFood.category.trim()
      );

      formData.append(
        'price',
        String(updatedFood.price)
      );

      if (updatedFood.image instanceof File) {
        formData.append(
          'image',
          updatedFood.image
        );
      }

      const response = await fetch(
        `${API_URL}/${updatedFood.id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          'Não foi possível atualizar o alimento.'
        );
      }

      /*
       * Atualiza somente o item alterado
       * sem precisar fazer uma nova requisição.
       */
      setFoods((currentFoods) =>
        currentFoods.map((food) =>
          food.id === updatedFood.id
            ? {
                ...food,
                ...updatedFood,
                price: Number(updatedFood.price),
                image:
                  updatedFood.image instanceof File
                    ? URL.createObjectURL(
                        updatedFood.image
                      )
                    : food.image,
              }
            : food
        )
      );

      /*
       * Atualiza contexto global.
       */
      await fetchFoodList();

      showAlert(
        'success',
        'Alimento atualizado com sucesso.'
      );

      handleCloseModal();
    } catch (err) {
      console.error(
        'Erro ao atualizar alimento:',
        err
      );

      showAlert(
        'error',
        'Erro ao atualizar o alimento.'
      );
    }
  };

  // ======================================================
  // CONTAGEM POR CATEGORIA
  // ======================================================

  const categoryCounts = useMemo(() => {
    const counts = {};

    foods.forEach((food) => {
      const category =
        food.category?.trim() || 'Sem Categoria';

      counts[category] =
        (counts[category] || 0) + 1;
    });

    return Object.entries(counts);
  }, [foods]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-list">
        <NavBarAdmin />

        <div className="app-content">
          <Sidebar />

          <main className="product-list">
            <div className="loading-container">
              <p>Carregando alimentos...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error && foods.length === 0) {
    return (
      <div className="admin-list">
        <NavBarAdmin />

        <div className="app-content">
          <Sidebar />

          <main className="product-list">
            <div className="error-container">
              <p>{error}</p>

              <button
                type="button"
                onClick={fetchFoods}
              >
                Tentar novamente
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="admin-list">

      <NavBarAdmin />

      <div className="app-content">

        <Sidebar />

        <main className="product-list">

          {/* ============================================
              CABEÇALHO
          ============================================ */}

          <header className="dashboard-header">

            <div className="page-title">
              <p className="lista-p">
                Lista de Alimentos
              </p>
            </div>

            {/* ==========================================
                RESUMO
            ========================================== */}

            <ProductSummary
              totalItems={totalItems}
              categoryCounts={categoryCounts}
            />

          </header>

          {/* ============================================
              TABELA
          ============================================ */}

          <ProductTable
            foods={foods}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          {/* ============================================
              PAGINAÇÃO
          ============================================ */}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />

        </main>

      </div>

      {/* ==============================================
          ALERTAS
      ============================================== */}

      {alert.message && (
        <div
          className={
            alert.type === 'error'
              ? 'alert-error'
              : 'alert-message'
          }
          role="alert"
        >
          {alert.message}
        </div>
      )}

      {/* ==============================================
          MODAL
      ============================================== */}

      {isModalOpen && selectedFood && (
        <EditFoodModal
          food={selectedFood}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}

    </div>
  );
};

// ======================================================
// SUMMARY
// ======================================================

const ProductSummary = ({
  totalItems,
  categoryCounts,
}) => {
  return (
    <div className="summary-cards">

      <div className="summary-card total">

        <FiBox size={24} />

        <div>
          <h3>Total de Alimentos</h3>
          <p>{totalItems}</p>
        </div>

      </div>

      {categoryCounts.map(
        ([category, count]) => (
          <div
            className="summary-card"
            key={category}
          >
            <FiTag size={20} />

            <div>
              <h3>{category}</h3>
              <p>
                {count}{' '}
                {count === 1
                  ? 'item'
                  : 'itens'}
              </p>
            </div>

          </div>
        )
      )}

    </div>
  );
};

// ======================================================
// PRODUCT TABLE
// ======================================================

const ProductTable = ({
  foods,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="table-container">

      <table className="product-table">

        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          {foods.length === 0 ? (
            <tr>
              <td colSpan="6">
                Nenhum alimento encontrado.
              </td>
            </tr>
          ) : (
            foods.map((food) => (
              <ProductRow
                key={food.id}
                food={food}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}

        </tbody>

      </table>

    </div>
  );
};

// ======================================================
// PRODUCT ROW
// ======================================================

const ProductRow = ({
  food,
  onDelete,
  onEdit,
}) => {
  const price = Number(food.price) || 0;

  return (
    <tr>

      <td>

        <img
          src={food.image}
          alt={`Imagem de ${food.name}`}
          className="product-image"
          loading="lazy"
        />

      </td>

      <td>
        {food.name}
      </td>

      <td>
        {food.description}
      </td>

      <td>
        {food.category || 'Sem Categoria'}
      </td>

      <td>
        R$ {price.toFixed(2)}
      </td>

      <td>

        <div className="icon-table">

          <button
            type="button"
            className="icon-button delete-button"
            onClick={() => onDelete(food.id)}
            title={`Excluir ${food.name}`}
            aria-label={`Excluir ${food.name}`}
          >
            <FiTrash2 size={20} />
          </button>

          <button
            type="button"
            className="icon-button edit-button"
            onClick={() => onEdit(food)}
            title={`Editar ${food.name}`}
            aria-label={`Editar ${food.name}`}
          >
            <FiEdit size={20} />
          </button>

        </div>

      </td>

    </tr>
  );
};

// ======================================================
// PAGINATION
// ======================================================

const Pagination = ({
  page,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <nav
      className="pagination"
      aria-label="Paginação de alimentos"
    >

      <button
        type="button"
        onClick={onPrevious}
        disabled={page === 0}
      >
        ‹ Anterior
      </button>

      <span>
        Página {page + 1} de {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages - 1}
      >
        Próximo ›
      </button>

    </nav>
  );
};

// ======================================================
// MODAL DE EDIÇÃO
// ======================================================

const EditFoodModal = ({
  food,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const [saving, setSaving] = useState(false);

  // ====================================================
  // INICIALIZAÇÃO
  // ====================================================

  useEffect(() => {
    if (!food) {
      return;
    }

    setName(food.name || '');
    setDescription(food.description || '');
    setCategory(food.category || '');
    setPrice(food.price ?? '');
    setPreview(food.image || '');
    setImage(null);
  }, [food]);

  // ====================================================
  // IMAGE CHANGE
  // ====================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Validação básica.
     */

    if (!file.type.startsWith('image/')) {
      alert('Selecione uma imagem válida.');
      return;
    }

    setImage(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanDescription =
      description.trim();
    const cleanCategory =
      category.trim();
    const numericPrice = Number(price);

    if (!cleanName) {
      alert('Informe o nome do alimento.');
      return;
    }

    if (!cleanDescription) {
      alert(
        'Informe a descrição do alimento.'
      );
      return;
    }

    if (!cleanCategory) {
      alert(
        'Informe a categoria do alimento.'
      );
      return;
    }

    if (
      !price ||
      Number.isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      alert('Informe um preço válido.');
      return;
    }

    setSaving(true);

    try {
      await onSave({
        id: food.id,
        name: cleanName,
        description: cleanDescription,
        category: cleanCategory,
        price: numericPrice,
        image,
      });
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-food-title"
    >

      <div className="modal-edit-food">

        <h2 id="edit-food-title">
          Editar Alimento
        </h2>

        <form onSubmit={handleSubmit}>

          {/* NOME */}

          <label htmlFor="food-name">
            Nome
          </label>

          <input
            id="food-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            disabled={saving}
          />

          {/* DESCRIÇÃO */}

          <label htmlFor="food-description">
            Descrição
          </label>

          <textarea
            id="food-description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value
              )
            }
            disabled={saving}
          />

          {/* CATEGORIA */}

          <label htmlFor="food-category">
            Categoria
          </label>

          <input
            id="food-category"
            type="text"
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value
              )
            }
            disabled={saving}
          />

          {/* PREÇO */}

          <label htmlFor="food-price">
            Preço
          </label>

          <input
            id="food-price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(event) =>
              setPrice(
                event.target.value
              )
            }
            disabled={saving}
          />

          {/* IMAGEM */}

          <label htmlFor="food-image">
            Imagem
          </label>

          <input
            id="food-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={saving}
          />

          {/* PREVIEW */}

          {preview && (
            <img
              src={preview}
              alt="Pré-visualização do alimento"
              className="image-preview"
            />
          )}

          {/* BOTÕES */}

          <div className="modal-buttons">

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Salvando...'
                : 'Salvar'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AdminListProduct;
