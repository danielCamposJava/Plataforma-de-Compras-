import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../Components/SidbarAdmin/Sidbar';
import NavBarAdmin from '../../Components/NavBarAdmin/NavBarAdmin';
import { assets } from '../../assets/admin_assets/assets';
import './CategoryManager.css';

export const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [renameTo, setRenameTo] = useState('');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/category/get-category');
      setCategories(response.data.categories || []);
      setError('');
    } catch {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) {
      setError('Informe o nome da nova categoria');
      setSuccess('');
      return;
    }
    if (!image) {
      setError('Informe uma imagem para a categoria');
      setSuccess('');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('category', newCategoryTitle.trim());
      formData.append('image', image);

      await axios.post('http://localhost:4000/category/create-category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Categoria criada com sucesso!');
      setError('');
      setNewCategoryTitle('');
      setImage(null);
      fetchCategories();
    } catch {
      setError('Erro ao criar categoria');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleRenameCategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError('Selecione uma categoria para renomear');
      setSuccess('');
      return;
    }
    if (!renameTo.trim()) {
      setError('Informe o novo nome da categoria');
      setSuccess('');
      return;
    }

    setLoading(true);
    try {
      await axios.put('http://localhost:4000/category/update-category', {
        oldCategory: selectedCategory.title,
        newCategory: renameTo.trim(),
      });

      setSuccess('Categoria renomeada com sucesso!');
      setError('');
      setRenameTo('');
      setSelectedCategory(null);
      fetchCategories();
    } catch {
      setError('Erro ao renomear categoria');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  
const handleDeleteCategory = async (category) => {
    const id = category?.id;

    if (!id) {
        setError("ID da categoria é obrigatório.");
        return;
    }

    const confirmed = window.confirm(
        `Tem certeza que deseja deletar a categoria "${category.title}"?`
    );

    if (!confirmed) {
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
        console.log("ID da categoria:", id);

        await axios.delete(
            `http://localhost:4000/category/delete-category/${id}`
        );

        setSuccess("Categoria deletada com sucesso!");

        setSelectedCategory(null);

        await fetchCategories();

    } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        console.error("Status:", error.response?.status);
        console.error("Resposta do backend:", error.response?.data);

        setError(
            error.response?.data?.message ||
            "Erro ao deletar categoria"
        );

    } finally {
        setLoading(false);
    }
};


  return (
    <div className="admin-page">
      <NavBarAdmin />
      <div 
      className="admin-content">
        <SideBar />
        <div className="category-manager">
          <h2>Gerenciar Categorias do Menu</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* Formulário de criação */}
          <form onSubmit={handleCreateCategory} className="category-form">
            <h3>Criar Nova Categoria</h3>
            <input
              type="text"
              placeholder="Nome da nova categoria"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              disabled={loading}
            />

            <input
              type="file"
              id="upload-image"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              disabled={loading}
            />

            {image ? (
              <>
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="preview-img"
                  />
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? 'Aguarde...' : 'Criar'}
                </button>

                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="remove-image-btn "
                  disabled={loading}
                >
                  Remover imagem
                </button>
              </>
            ) : (
              <>
                <label
                  htmlFor="upload-image"
                  className="upload-label"
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  <img src={assets.upload_area} alt="Upload" className="upload-icon" />
                  Clique para enviar imagem
                </label>
                <button type="submit" disabled={loading}>
                  {loading ? 'Aguarde...' : 'Criar'}
                </button>
              </>
            )}
          </form>

          {/* Lista de categorias */}
          <h3>Categorias Existentes</h3>
          {loading && <p>Carregando categorias...</p>}
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                <img
                  src={cat.image ? `http://localhost:4000/uploads/${cat.image}` : assets.default_category_img}
                  alt={cat.title}
                  className="category-image"
                />
                <span>{cat.title}</span>
                <button onClick={() => handleDeleteCategory(cat)} className="delete-btn" disabled={loading}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>

          {/* Formulário de renomeação */}
          <form onSubmit={handleRenameCategory} className="category-form">
            <h3>Renomear Categoria</h3>
            <select
              value={selectedCategory ? selectedCategory.id : ''}
              onChange={(e) => {
                const found = categories.find((cat) => cat.id === Number(e.target.value));
                setSelectedCategory(found || null);
              }}
              disabled={loading}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Novo nome da categoria"
              value={renameTo}
              onChange={(e) => setRenameTo(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Aguarde...' : 'Renomear'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
