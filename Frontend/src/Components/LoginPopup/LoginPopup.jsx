
import React, {
    useState,
    useEffect,
    useContext
} from "react";

import "./LoginPopup.css";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Content/StoreContent";

const API_URL = "http://localhost:4000";

const LoginPopup = ({ setShowLogin }) => {

    // ============================================================
    // ESTADOS
    // ============================================================

    const [currState, setCurrState] = useState("Login");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        cnpj: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [cnpjError, setCnpjError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isVerifyingToken, setIsVerifyingToken] = useState(true);

    const [toast, setToast] = useState({
        show: false,
        type: "",
        message: ""
    });

    const navigate = useNavigate();

    const { setUser } = useContext(StoreContext);

    // ============================================================
    // TOAST
    // ============================================================

    const showToast = (type, message) => {

        setToast({
            show: true,
            type,
            message
        });

        setTimeout(() => {

            setToast({
                show: false,
                type: "",
                message: ""
            });

        }, 3500);
    };

    // ============================================================
    // VERIFICAR TOKEN
    // ============================================================

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
                    `${API_URL}/users/verify-token`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

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

        // ========================================================
        // REMEMBER ME
        // ========================================================

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

    // ============================================================
    // ALTERAÇÃO DOS INPUTS
    // ============================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        // ========================================================
        // EMAIL
        // ========================================================

        if (name === "email") {

            setFormData(prev => ({
                ...prev,
                email: value
            }));

            if (
                value &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {

                setEmailError(
                    "Formato de e-mail inválido."
                );

            } else {

                setEmailError("");
            }

            return;
        }

        // ========================================================
        // CNPJ
        // ========================================================

        if (name === "cnpj") {

            const numbers =
                value.replace(/\D/g, "");

            setFormData(prev => ({
                ...prev,
                cnpj: numbers
            }));

            if (
                numbers.length > 0 &&
                numbers.length !== 14
            ) {

                setCnpjError(
                    "O CNPJ deve possuir 14 números."
                );

            } else {

                setCnpjError("");
            }

            return;
        }

        // ========================================================
        // CHECKBOX
        // ========================================================

        if (type === "checkbox") {

            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));

            return;
        }

        // ========================================================
        // SELECT E OUTROS
        // ========================================================

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ============================================================
    // VALIDAÇÃO
    // ============================================================

    const validateForm = () => {

        setErrorMessage("");

        // ========================================================
        // EMAIL
        // ========================================================

        if (
            !formData.email.trim() ||
            emailError
        ) {

            setErrorMessage(
                "Informe um e-mail válido."
            );

            return false;
        }

        // ========================================================
        // SENHA
        // ========================================================

        if (
            formData.password.trim().length < 6
        ) {

            setErrorMessage(
                "A senha deve ter pelo menos 6 caracteres."
            );

            return false;
        }

        // ========================================================
        // CADASTRO
        // ========================================================

        if (currState === "Sign Up") {

            if (!formData.name.trim()) {

                setErrorMessage(
                    "Nome é obrigatório."
                );

                return false;
            }

            // ====================================================
            // CNPJ
            // ====================================================

            if (formData.role === "seller") {

                const cnpj =
                    formData.cnpj.replace(/\D/g, "");

                if (cnpj.length !== 14) {

                    setErrorMessage(
                        "Informe um CNPJ válido com 14 números."
                    );

                    return false;
                }
            }
        }

        return true;
    };

    // ============================================================
    // PEGAR MENSAGEM DO AXIOS
    // ============================================================

    const getErrorMessage = (error) => {

        // --------------------------------------------------------
        // Sem resposta do servidor
        // --------------------------------------------------------

        if (!error.response) {

            if (error.request) {

                return "Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 4000.";

            }

            return (
                error.message ||
                "Erro ao realizar a requisição."
            );
        }

        // --------------------------------------------------------
        // Backend respondeu
        // --------------------------------------------------------

        const data = error.response.data;

        if (typeof data === "string") {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.error) {
            return data.error;
        }

        // --------------------------------------------------------
        // Status HTTP
        // --------------------------------------------------------

        switch (error.response.status) {

            case 400:
                return "Dados inválidos. Verifique os campos.";

            case 401:
                return "E-mail ou senha incorretos.";

            case 403:
                return "Você não possui permissão para realizar esta ação.";

            case 404:
                return "Rota não encontrada no servidor.";

            case 409:
                return "Este e-mail já está cadastrado.";

            case 500:
                return "Erro interno no servidor.";

            default:
                return `Erro no servidor. Código: ${error.response.status}`;
        }
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {

            // ====================================================
            // CADASTRO
            // ====================================================

            if (currState === "Sign Up") {

                const registerData = {
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    role: formData.role
                };

                // CNPJ somente para vendedor
                if (formData.role === "seller") {

                    registerData.cnpj =
                        formData.cnpj.replace(/\D/g, "");
                }

                console.log(
                    "Dados enviados para cadastro:",
                    registerData
                );

                const response = await axios.post(
                    `${API_URL}/users/register`,
                    registerData,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        timeout: 10000
                    }
                );

                showToast(
                    "success",
                    response.data?.message ||
                    "Conta criada com sucesso!"
                );

                // ------------------------------------------------
                // VOLTAR PARA LOGIN
                // ------------------------------------------------

                setCurrState("Login");

                setFormData(prev => ({
                    ...prev,
                    name: "",
                    password: "",
                    role: "user",
                    cnpj: ""
                }));

                setEmailError("");
                setCnpjError("");
                setErrorMessage("");

                return;
            }

            // ====================================================
            // LOGIN
            // ====================================================

            const response = await axios.post(
                `${API_URL}/users/login`,
                {
                    email: formData.email.trim(),
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 10000
                }
            );

            // ====================================================
            // VALIDAR RESPOSTA
            // ====================================================

            if (
                !response.data ||
                !response.data.token ||
                !response.data.user
            ) {

                showToast(
                    "error",
                    "O servidor não retornou os dados de autenticação."
                );

                return;
            }

            const {
                token,
                user
            } = response.data;

            // ====================================================
            // SALVAR TOKEN
            // ====================================================

            localStorage.setItem(
                "token",
                token
            );

            // ====================================================
            // SALVAR USUÁRIO
            // ====================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // ====================================================
            // COMPATIBILIDADE
            // ====================================================

            localStorage.setItem(
                "userName",
                user.name || ""
            );

            localStorage.setItem(
                "userId",
                user.id || ""
            );

            localStorage.setItem(
                "userRole",
                user.role || "user"
            );

            // ====================================================
            // CONTEXTO
            // ====================================================

            setUser(user);

            // ====================================================
            // REMEMBER ME
            // ====================================================

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

            // ====================================================
            // TOAST
            // ====================================================

            showToast(
                "success",
                `Bem-vindo, ${user.name || "usuário"}!`
            );

            // ====================================================
            // FECHAR E REDIRECIONAR
            // ====================================================

            setTimeout(() => {

                setShowLogin(false);

                if (user.role === "admin") {

                    navigate("/admin");

                } else if (user.role === "seller") {

                    navigate("/profile");

                } else {

                    navigate("/profile");
                }

            }, 800);

        } catch (error) {

            console.error(
                "========== ERRO NA AUTENTICAÇÃO =========="
            );

            console.error(
                "Erro:",
                error
            );

            console.error(
                "Mensagem:",
                error.message
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Resposta:",
                error.response?.data
            );

            console.error(
                "URL:",
                error.config?.url
            );

            console.error(
                "=========================================="
            );

            const message =
                getErrorMessage(error);

            showToast(
                "error",
                message
            );

        } finally {

            setIsLoading(false);
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

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

    // ============================================================
    // INTERFACE
    // ============================================================

    return (

        <div
            className="login-popup"
            role="dialog"
            aria-modal="true"
        >

            {/* ====================================================
                TOAST
            ===================================================== */}

            {toast.show && (

                <div
                    className={`auth-toast ${toast.type}`}
                    role="alert"
                >

                    <div className="auth-toast-icon">

                        {toast.type === "success"
                            ? "✓"
                            : "✕"
                        }

                    </div>

                    <div className="auth-toast-content">

                        <strong>

                            {toast.type === "success"
                                ? "Sucesso"
                                : "Erro"
                            }

                        </strong>

                        <span>
                            {toast.message}
                        </span>

                    </div>

                </div>
            )}

            {/* ====================================================
                FORMULÁRIO
            ===================================================== */}

            <form
                className="login-popup-container"
                onSubmit={handleSubmit}
            >

                {/* =================================================
                    HEADER
                ================================================== */}

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

                {/* =================================================
                    INPUTS
                ================================================== */}

                <div className="login-popup-inputs">

                    {/* =================================================
                        CADASTRO
                    ================================================== */}

                    {currState === "Sign Up" && (

                        <>

                            {/* NOME */}

                            <input
                                type="text"
                                name="name"
                                placeholder="Seu nome ou nome da empresa"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            {/* TIPO DE CONTA */}

                            <div className="account-type">

                                <label htmlFor="role">
                                    Tipo de conta
                                </label>

                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >

                                    <option value="user">
                                        Cliente
                                    </option>

                                    <option value="seller">
                                        Empresa / Vendedor
                                    </option>

                                </select>

                            </div>

                            {/* =================================================
                                CNPJ
                            ================================================== */}

                            {formData.role === "seller" && (

                                <>

                                    <input
                                        type="text"
                                        name="cnpj"
                                        placeholder="CNPJ"
                                        value={formData.cnpj}
                                        onChange={handleChange}
                                        maxLength={14}
                                        inputMode="numeric"
                                        required
                                    />

                                    {cnpjError && (

                                        <p className="error-message">
                                            {cnpjError}
                                        </p>

                                    )}

                                </>
                            )}

                        </>
                    )}

                    {/* =================================================
                        EMAIL
                    ================================================== */}

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

                    {/* =================================================
                        SENHA
                    ================================================== */}

                    <input
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {/* =================================================
                        LEMBRAR DE MIM
                    ================================================== */}

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

                {/* =================================================
                    ERRO
                ================================================== */}

                {errorMessage && (

                    <p className="error-message">
                        {errorMessage}
                    </p>

                )}

                {/* =================================================
                    BOTÃO
                ================================================== */}

                <button
                    type="submit"
                    disabled={isLoading}
                >

                    {isLoading
                        ? "Processando..."
                        : currState === "Sign Up"
                            ? "Criar conta"
                            : "Entrar"
                    }

                </button>

                {/* =================================================
                    TROCAR LOGIN / CADASTRO
                ================================================== */}

                {currState === "Login" ? (

                    <p>

                        Não tem uma conta?{" "}

                        <span
                            className="toggle-state"
                            onClick={() => {

                                setCurrState("Sign Up");

                                setErrorMessage("");
                                setEmailError("");
                                setCnpjError("");

                                setFormData(prev => ({
                                    ...prev,
                                    name: "",
                                    password: "",
                                    role: "user",
                                    cnpj: ""
                                }));
                            }}
                        >
                            Cadastre-se
                        </span>

                    </p>

                ) : (

                    <p>

                        Já tem uma conta?{" "}

                        <span
                            className="toggle-state"
                            onClick={() => {

                                setCurrState("Login");

                                setErrorMessage("");
                                setEmailError("");
                                setCnpjError("");

                                setFormData(prev => ({
                                    ...prev,
                                    password: "",
                                    role: "user",
                                    cnpj: ""
                                }));
                            }}
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
