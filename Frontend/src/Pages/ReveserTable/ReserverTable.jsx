import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReserverTable.css';
import tableIcon from '../../assets/table.jpg';

const BASE_API = 'http://localhost:4000';

export const ReserverTable = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios
      .get(`${BASE_API}/tables`)
      .then((res) => {
        setTables(res.data.tables || []);
      })
      .catch((err) => {
        console.error('Erro ao buscar mesas:', err);
        setTables([]);
      });
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTableClick = (table) => {
    if (table.is_available === 1) {
      setSelectedTable(table);
      setMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      setMsg('Selecione uma mesa disponível.');
      return;
    }

    try {
      const user_id = 'cliente_fake_id'; // Substituir por ID real com autenticação

      await axios.post(`${BASE_API}/booking`, {
        ...form,
        user_id,
        table_id: selectedTable.id,
      });

      setMsg(`✅ Reserva feita com sucesso para a ${selectedTable.name}!`);
      setForm({ name: '', phone: '', date: '', time: '' });
      setSelectedTable(null);

      const updated = await axios.get(`${BASE_API}/tables`);
      setTables(updated.data.tables || []);

      // ✅ Envia mensagem para o WhatsApp do cliente
      const whatsappMessage = `Olá ${form.name}, sua reserva foi feita com sucesso para o dia ${form.date} às ${form.time} na mesa ${selectedTable.name}.`;
      const phoneNumber = form.phone.replace(/\D/g, '');
      const whatsappURL = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappURL, '_blank');
    } catch (err) {
      console.error('Erro ao fazer reserva:', err);
      setMsg('❌ Erro ao fazer reserva.');
    }
  };

  const rows = tables.reduce((acc, table) => {
    (acc[table.location] = acc[table.location] || []).push(table);
    return acc;
  }, {});
  const sortedRows = Object.keys(rows).sort();

  const totalDisponiveis = tables.filter((t) => t.is_available === 1).length;
  const totalReservadas = tables.filter((t) => t.is_available === 0).length;

  return (
    <div className="reserver-container">
      <h1 className="title_h1">Olá, vamos fazer sua reserva?</h1>

      {/* ✅ Card de status */}
      <div className="status-card">
        <p className="title_h2">Selecione sua Mesa</p>
        <div className="status-item available-status">
          ✅ Disponíveis: <strong>{totalDisponiveis}</strong>
        </div>
        <div className="status-item reserved-status">
          ❌ Ocupadas: <strong>{totalReservadas}</strong>
        </div>
      </div>

      {/* ✅ Mesas */}
      <div className="cinema-seating">
        {sortedRows.map((rowKey) => (
          <div key={rowKey} className="seat-row">
            <div className="row-label">{rowKey}</div>
            {rows[rowKey].map((table) => (
              <div
                key={table.id}
                className={`seat ${
                  table.is_available === 1 ? 'available' : 'unavailable'
                } ${selectedTable?.id === table.id ? 'selected' : ''}`}
                onClick={() => handleTableClick(table)}
                title={`${table.name} - Capacidade: ${table.capacity}`}
              >
                <img
                  src={tableIcon}
                  alt="Mesa"
                  className="table-image"
                  style={{
                    opacity: table.is_available === 1 ? 1 : 0.4,
                    filter:
                      selectedTable?.id === table.id
                        ? 'drop-shadow(0 0 6px #28a745)'
                        : 'none',
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ✅ Formulário */}
      <form onSubmit={handleSubmit} className="reserver-form">
        <h3 className="title_h3">Formulário de Reserva</h3>
        <input
          type="text"
          name="name"
          placeholder="Seu nome"
          value={form.name}
          onChange={handleFormChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefone com DDD"
          value={form.phone}
          onChange={handleFormChange}
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleFormChange}
          required
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleFormChange}
          required
        />
        <button type="submit">  Fazer a Reserva</button>
      </form>

      {/* ✅ Mensagem */}
      {msg && (
        <p
          className={`reserver-msg ${
            msg.includes('sucesso') ? 'success' : 'error'
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
};
