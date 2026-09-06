
import React, { useState } from "react";

import NavBar from "./Components/Navbar/NavBar";
import "./App.css";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import Footer from "./Components/Footer/Footer";
import LoginPopup from "./Components/LoginPopup/LoginPopup";

import AdminHome from "./Pages/Admin/AdminHome";
import AdminListProduct from "./Pages/List/AdminListProduct";
import PagesDetails from "./Pages/FoodDetails/PagesDetails";
import ProfileUser from "./Pages/ProFileUsers/ProfileUser";
import AdminOrderPayment from "./Pages/Order/AdminOrderPayment";

import { SendRequest } from "./Pages/SendRequest/SendRequest";
import CategoryManager from "./Pages/CategoryManager/CategoryManager";
import { ReserverTable } from "./Pages/ReveserTable/ReserverTable";
import { AdminReserve } from "./Pages/AdminReserve/AdminReserve";

// ============================================================
// PÁGINA DE CATEGORIA
// ============================================================

import Category from "./Pages/Category/Category";

const App = () => {

    const [showLogin, setShowLogin] = useState(false);

    return (

        <div className="App">

            {showLogin ? (

                <LoginPopup
                    setShowLogin={setShowLogin}
                />

            ) : (

                <>

                    <NavBar
                        setShowLogin={setShowLogin}
                    />

                    <Routes>

                        {/* HOME */}

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        {/* CATEGORIA */}

                        <Route
                            path="/categoria/:category"
                            element={<Category />}
                        />

                        {/* ADMIN */}

                        <Route
                            path="/admin"
                            element={<AdminHome />}
                        />

                        <Route
                            path="/admin/list"
                            element={<AdminListProduct />}
                        />

                        <Route
                            path="/orders"
                            element={<AdminOrderPayment />}
                        />

                        <Route
                            path="/admin/reserve"
                            element={<AdminReserve />}
                        />

                        {/* USUÁRIO */}

                        <Route
                            path="/profile"
                            element={<ProfileUser />}
                        />

                        {/* PRODUTO */}

                        <Route
                            path="/product/:id"
                            element={<PagesDetails />}
                        />

                        {/* CARRINHO */}

                        <Route
                            path="/cart"
                            element={<Cart />}
                        />

                        {/* CATEGORIAS ADMIN */}

                        <Route
                            path="/list"
                            element={<CategoryManager />}
                        />

                        {/* SOLICITAÇÃO */}

                        <Route
                            path="/sendrequest"
                            element={<SendRequest />}
                        />

                        {/* RESERVA */}

                        <Route
                            path="/reserve"
                            element={<ReserverTable />}
                        />

                    </Routes>

                    <Footer />

                </>

            )}

        </div>
    );
};

export default App;
