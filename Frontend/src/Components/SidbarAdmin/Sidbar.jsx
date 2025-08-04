import React from 'react';
import './Sidbar.css';
import { useNavigate } from 'react-router-dom';
import { MdAddBox, MdDashboard, MdCategory, MdListAlt, MdTableBar } from 'react-icons/md'; // importando ícones

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-options">

        <div className="sidebar-option" onClick={() => navigate('/admin')}>
          <MdAddBox size={24} />
          <p>Adicionar Item</p>
        </div>

        <div className="sidebar-option" onClick={() => navigate('/list')}>
          <MdCategory size={24} />
          <p>Gerenciar Categorias</p>
        </div>

        <div className="sidebar-option" onClick={() => navigate('/admin/list')}>
          <MdListAlt size={24} />
          <p>Lista de Itens</p>
        </div>
         
            
        <div className="sidebar-option" onClick={() => navigate('/admin/reserve')}>
          <MdTableBar size={24} />
          <p>Geremciar Mesas</p>
        </div>
      
        <div className="sidebar-option" onClick={() => navigate('/orders')}>
          <MdDashboard size={24} />
          <p>Dashboard</p>
        </div>



      </div>
    </div>
  );
};

export default Sidebar;
