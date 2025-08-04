import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import NavBarAdmin from '../../Components/NavBarAdmin/NavBarAdmin';
import Sidebar from '../../Components/SidbarAdmin/Sidbar';
import './AdminReserve.css';



export const AdminReserve = () => {
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingSeed, setLoadingSeed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '',
    capacity: '',
    location: '',
    is_available: '',
    icon: '',
  });

  const BASE_API = 'http://localhost:4000';
  const ITEMS_PER_PAGE = 10;

  const loadTables = async () => {
    try {
      const res = await axios.get(`${BASE_API}/tables`);
      setTables(Array.isArray(res.data.tables) ? res.data.tables : []);
    } catch (err) {
      console.error('Erro ao carregar mesas:', err.message);
      setTables([]);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleSeedTables = async () => {
    if (loadingSeed) return;
    setLoadingSeed(true);
    try {
      await axios.post(`${BASE_API}/tables/seed`);
      await loadTables();
      alert('Mesas populadas com sucesso!');
    } catch (error) {
      alert('Erro ao popular mesas');
    } finally {
      setLoadingSeed(false);
    }
  };

  const handleEdit = (table) => {
    setForm({
      name: table.name,
      capacity: table.capacity,
      location: table.location,
      is_available: table.is_available,
      icon: table.icon,
    });
    setEditingId(table.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente deletar esta mesa?')) return;
    try {
      await axios.delete(`${BASE_API}/tables/${id}`);
      setSuccess('Mesa deletada com sucesso!');
      await loadTables();
    } catch (err) {
      setError('Erro ao deletar mesa.');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${BASE_API}/tables/${editingId}`, form);
        setSuccess('Mesa atualizada com sucesso!');
      }
      setForm({ name: '', capacity: '', location: '', is_available: '', icon: '' });
      setEditingId(null);
      setShowModal(false);
      await loadTables();
    } catch (err) {
      setError('Erro ao salvar mesa.');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ name: '', capacity: '', location: '', is_available: '', icon: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTables.length / ITEMS_PER_PAGE);
  const currentTables = filteredTables.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPreviousPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="admin-page-reserve">
      <NavBarAdmin />
      <div className="admin-contente-rever">
        <Sidebar />

        <div className="reserver-manager">
          <h2>Gerenciar Mesas</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Filtrar mesas pelo nome..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button onClick={handleSeedTables} disabled={loadingSeed}>
              {loadingSeed ? 'Populando...' : 'Criar 50 mesas'}
            </button>
          </div>

          <table className="table-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Capacidade</th>
                <th>Localização</th>
                <th>Disponível</th>
                <th>Ícone</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentTables.length ? (
                currentTables.map((table) => (
                  <tr key={table.id}>
                    <td>{table.id}</td>
                    <td>{table.name}</td>
                    <td>{table.capacity}</td>
                    <td>{table.location}</td>
                    <td>{table.is_available ? 'Sim' : 'Não'}</td>
                    <td>{table.icon || '-'}</td>
                    <td>
                      <button onClick={() => handleEdit(table)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(table.id)} style={{ color: 'red' }}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Nenhuma mesa encontrada</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-controls" style={{ marginTop: '15px' }}>
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages}>
              Próximo
            </button>
          </div>

          {/* MODAL */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h3>Editar Mesa</h3>
                <form onSubmit={handleSubmit}>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" required />
                  <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacidade" />
                  <input name="location" value={form.location} onChange={handleChange} placeholder="Localização" />
                  <input name="is_available" value={form.is_available} onChange={handleChange} placeholder="Disponível (true/false)" />
                  <input name="icon" value={form.icon} onChange={handleChange} placeholder="Ícone" />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" onClick={handleModalClose}>Cancelar</button>
                    <button type="submit" disabled={loading}>Salvar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReserve;
