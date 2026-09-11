import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import './LoginPopup.css';

import axios from 'axios';

import { assets } from '../../assets/frontend_assets/assets';

import { useNavigate } from 'react-router-dom';

import { StoreContext } from '../../Content/StoreContent';


const LoginPopup = ({ setShowLogin }) => {

    const [currState, setCurrState] = useState("Login");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        isAdmin: false
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isVerifyingToken, setIsVerifyingToken] = useState(true);

    const navigate = useNavigate();

    /*
     * IMPORTANTE:
     * O setUser atualiza a navbar imediatamente depois do login.
     */
    const { setUser } = useContext(StoreContext);


    /* =====================================================
       VERIFICAR SESSÃO EXISTENTE
    ===================================================== */

    useEffect(() => {

        const verifySession = async () => {

            const token = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");

            if (!token) {
                setIsVerifyingToken(false);
                return;
            }

            try {

                const response = await axios.get(
                    "http://localhost:4000/users/verify-token",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                /*
                 * Se o backend retornar o usuário,
                 * usamos ele.
                 */
                let loggedUser = null;

                if (response.data?.user) {

                    loggedUser = response.data.user;

                } else if (savedUser) {

                    try {
                        loggedUser = JSON.parse(savedUser);
                    } catch {
                        loggedUser = null;
                    }
                }

                if (loggedUser) {

                    setUser(loggedUser);

                    if (loggedUser.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/profile");
                    }
                }

            } catch (error) {

                console.error(
                    "Erro ao verificar sessão:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("userName");
                localStorage.removeItem("userId");
                localStorage.removeItem("userRole");

                setUser(null);

            } finally {

                setIsVerifyingToken(false);
            }
        };


        verifySession();


        /* =====================================================
           REMEMBER ME
        ===================================================== */

        const savedEmail =
            localStorage.getItem("storedEmail");

        const savedRemember =
            localStorage.getItem("storedRememberMe");

        if (
            savedEmail &&
            savedRemember === "true"
        ) {

            setFormData(prev => ({
                ...prev,
                email: savedEmail
            }));

            setRememberMe(true);
        }

    }, [navigate, setUser]);


    /* =====================================================
       INPUTS
    ===================================================== */

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        if (name === "email") {

            setFormData(prev => ({
                ...prev,
                email: value
            }));

            if (
                !/\S+@\S+\.\S+/.test(value)
            ) {

                setEmailError(
                    "Formato de e-mail inválido."
                );

            } else {

                setEmailError("");
            }

            return;
        }


        if (type === "checkbox") {

            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));

            return;
        }


        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    /* =====================================================
       VALIDAÇÃO
    ===================================================== */

    const validateForm = () => {

        if (
            currState === "Sign Up" &&
            !formData.name.trim()
        ) {

            setErrorMessage(
                "Nome é obrigatório."
            );

            return false;
        }


        if (
            !formData.email.trim() ||
            emailError
        ) {

            setErrorMessage(
                "É necessário um e-mail válido."
            );

            return false;
        }


        if (
            formData.password.trim().length < 6
        ) {

            setErrorMessage(
                "A senha deve ter pelo menos 6 caracteres."
            );

            return false;
        }


        return true;
    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);


        try {

            /* =================================================
               CADASTRO
            ================================================= */

            if (currState === "Sign Up") {

                const response = await axios.post(
                    "http://localhost:4000/users/register",
                    {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,

                        role: formData.isAdmin
                            ? "admin"
                            : "user"
                    }
                );


                alert(
                    response.data.message ||
                    "Conta criada com sucesso!"
                );


                setCurrState("Login");

                setFormData(prev => ({
                    ...prev,
                    password: "",
                    isAdmin: false
                }));


                return;
            }


            /* =================================================
               LOGIN
            ================================================= */

            const response = await axios.post(
                "http://localhost:4000/users/login",
                {
                    email: formData.email,
                    password: formData.password
                }
            );


            if (
                !response.data ||
                !response.data.token ||
                !response.data.user
            ) {

                setErrorMessage(
                    "Falha no login. Verifique suas credenciais."
                );

                return;
            }


            const {
                token,
                user
            } = response.data;


            /* =================================================
               SALVAR SESSÃO
            ================================================= */

            localStorage.setItem(
                "token",
                token
            );


            /*
             * Salva o usuário completo.
             * Isso permite recuperar a sessão depois
             * que a página for atualizada.
             */
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            /*
             * Mantemos também seus dados antigos
             * para não quebrar outras partes do projeto.
             */
            localStorage.setItem(
                "userName",
                user.name
            );

            localStorage.setItem(
                "userId",
                user.id
            );

            localStorage.setItem(
                "userRole",
                user.role
            );


            /* =================================================
               ATUALIZAR CONTEXTO
            ================================================= */

            /*
             * ESSA LINHA É FUNDAMENTAL.
             *
             * Faz a NavBar mudar de:
             *
             * Sign In
             *
             * para:
             *
             * Nome + Logout
             */
            setUser(user);


            /* =================================================
               REMEMBER ME
            ================================================= */

            if (rememberMe) {

                localStorage.setItem(
                    "storedEmail",
                    formData.email
                );

                localStorage.setItem(
                    "storedRememberMe",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "storedEmail"
                );

                localStorage.removeItem(
                    "storedRememberMe"
                );
            }


            /* =================================================
               FECHAR LOGIN
            ================================================= */

            setShowLogin(false);


            /* =================================================
               REDIRECIONAMENTO
            ================================================= */

            if (user.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/profile");
            }


        } catch (error) {

            console.error(
                "Erro no login:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Ocorreu um erro inesperado. Tente novamente."
            );

        } finally {

            setIsLoading(false);
        }
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (isVerifyingToken) {

        return (
            <div
                className="login-popup loading"
                role="status"
                aria-live="polite"
            >

                <img
                    src={assets.logo}
                    alt="Carregando..."
                    className="logo-spinner"
                />

            </div>
        );
    }


    /* =====================================================
       INTERFACE
    ===================================================== */

    return (

        <div
            className="login-popup"
            role="dialog"
            aria-modal="true"
        >

            <form
                className="login-popup-container"
                onSubmit={handleSubmit}
            >

                {/* HEADER */}

                <div className="login-popup-header">

                    <img
                        className="login-popup-logo"
                        src={assets.logo}
                        alt="App Logo"
                    />

                    <div className="login-popup-title">

                        <h2>
                            {currState === "Login"
                                ? "Entrar"
                                : "Criar conta"
                            }
                        </h2>

                        <img
                            onClick={() =>
                                setShowLogin(false)
                            }
                            src={assets.cross_icon}
                            alt="Fechar"
                            aria-label="Fechar login"
                        />

                    </div>

                </div>


                {/* INPUTS */}

                <div className="login-popup-inputs">

                    {currState === "Sign Up" && (

                        <>

                            <input
                                type="text"
                                name="name"
                                placeholder="Seu nome"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />


                            <label className="admin-checkbox-label">

                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={formData.isAdmin}
                                    onChange={handleChange}
                                />

                                Registrar como empresa

                            </label>

                        </>

                    )}


                    <input
                        type="email"
                        name="email"
                        placeholder="Seu e-mail"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />


                    {emailError && (

                        <p className="error-message">
                            {emailError}
                        </p>

                    )}


                    <input
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />


                    {currState === "Login" && (

                        <div className="login-popup-remember">

                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() =>
                                    setRememberMe(
                                        prev => !prev
                                    )
                                }
                            />

                            <label htmlFor="rememberMe">
                                Lembrar de mim
                            </label>

                        </div>

                    )}

                </div>


                {/* ERRO */}

                {errorMessage && (

                    <p className="error-message">
                        {errorMessage}
                    </p>

                )}


                {/* BOTÃO */}

                <button
                    type="submit"
                    disabled={isLoading}
                >

                    {isLoading
                        ? "Entrando..."
                        : currState === "Sign Up"
                            ? "Criar conta"
                            : "Entrar"
                    }

                </button>


                {/* ALTERAR LOGIN/CADASTRO */}

                {currState === "Login" ? (

                    <p>

                        Não tem uma conta?{" "}

                        <span
                            onClick={() =>
                                setCurrState("Sign Up")
                            }
                            className="toggle-state"
                        >
                            Cadastre-se
                        </span>

                    </p>

                ) : (

                    <p>

                        Já tem uma conta?{" "}

                        <span
                            onClick={() =>
                                setCurrState("Login")
                            }
                            className="toggle-state"
                        >
                            Faça login
                        </span>

                    </p>

                )}

            </form>

        </div>
    );
};

export default LoginPopup;