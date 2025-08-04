import React, { useState } from 'react';
import NavBar from './Components/Navbar/NavBar';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Cart from './Pages/Cart/Cart';
 // Corrigido o nome do componente
import Footer from './Components/Footer/Footer';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import AdminHome from './Pages/Admin/AdminHome';
import AdminListProduct from './Pages/List/AdminListProduct';
import PagesDetails from './Pages/FoodDetails/PagesDetails';
import ProfileUser from './Pages/ProFileUsers/ProfileUser';
import AdminOrderPayment from './Pages/Order/AdminOrderPayment';
import { SendRequest } from './Pages/SendRequest/SendRequest';
import CategoryManager from './Pages/CategoryManager/CategoryManager';
import { ReserverTable } from './Pages/ReveserTable/ReserverTable';
import { AdminReserve } from './Pages/AdminReserve/AdminReserve';
const App = () => {
  const [showLogin, setShowLogin] = useState(false); // Inicia sem mostrar a tela de login

  return (
    <div className="App">
      {showLogin ? (
        <LoginPopup setShowLogin={setShowLogin} />  // Mostra o popup de login se showLogin for true
      ) : (
        <>
          <NavBar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<AdminHome/>}/>
            <Route path='/profile'element={<ProfileUser/>}></Route>
            <Route path='/admin/list' element={<AdminListProduct/>}/>
            <Route path='/orders' element={<AdminOrderPayment/>}/>
            <Route path='/product/:id' element={<PagesDetails />} /> {/* Rota de detalhe do produto */}
            <Route path='/cart' element={<Cart />} />
            <Route path='/list' element ={<CategoryManager/>}/>
            <Route path='/sendrequest' element={<SendRequest/>}/>
            <Route path = '/reserve' element={<ReserverTable/>}/>
            <Route path='/admin/reserve' element={<AdminReserve/>}/>
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
