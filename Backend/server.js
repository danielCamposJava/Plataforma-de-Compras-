
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import productRoutes from "./router/ProductsRouter.js";
import userRoutes from "./Router/userRoutes.js";
import orderRoutes from "./Router/createOrdeRoutes.js";
import categoryRoutes from "./Router/categoryRouter.js";
import tableRoutes from "./Router/tableRouter.js";
import bookingRoutes from "./Router/bookingRouter.js";

dotenv.config();

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port = process.env.PORT || 4000;

const server = http.createServer(app);

// ======================================================
// CORS
// ======================================================

const isDev = process.env.NODE_ENV !== "production";

const allowedOrigins = isDev
    ? [/^http:\/\/localhost:\d+$/]
    : [
        "https://delivery-br1d.vercel.app"
    ];

const checkOrigin = (origin, callback) => {

    if (!origin) {
        return callback(null, true);
    }

    const isAllowed = allowedOrigins.some((allowed) => {

        if (allowed instanceof RegExp) {
            return allowed.test(origin);
        }

        return allowed === origin;

    });

    if (!isAllowed) {

        console.error(
            `CORS bloqueou a origem: ${origin}`
        );

        return callback(
            new Error("Origem não permitida pelo CORS"),
            false
        );

    }

    return callback(null, true);
};

// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(server, {

    cors: {
        origin: checkOrigin,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE"
        ],

        credentials: true
    }

});

app.set("io", io);

// ======================================================
// MIDDLEWARES
// ======================================================

app.use(express.json());

app.use(
    cors({
        origin: checkOrigin,
        credentials: true
    })
);

// ======================================================
// ARQUIVOS ESTÁTICOS
// ======================================================
//
// Backend/uploads/arquivo.png
//
// será acessível através de:
//
// http://localhost:4000/uploads/arquivo.png
//

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

// ======================================================
// TESTE DA API
// ======================================================

app.get("/", (req, res) => {

    return res.status(200).json({
        message: "API Working com Socket.io"
    });

});

// ======================================================
// ROTAS
// ======================================================

app.use("/api", orderRoutes);

app.use("/api/foods", productRoutes);

app.use("/users", userRoutes);

app.use("/category", categoryRoutes);

app.use("/tables", tableRoutes);

app.use("/booking", bookingRoutes);

// ======================================================
// 404
// ======================================================

app.use((req, res) => {

    return res.status(404).json({

        message: "Rota não encontrada",

        method: req.method,

        path: req.originalUrl

    });

});

// ======================================================
// SOCKET
// ======================================================

io.on("connection", (socket) => {

    console.log(
        "Novo cliente conectado via WebSocket:",
        socket.id
    );

    socket.on("disconnect", () => {

        console.log(
            "Cliente desconectado:",
            socket.id
        );

    });

});

// ======================================================
// NOTIFICAÇÃO
// ======================================================

export const notifyNewOrder = (order) => {

    io.emit(
        "newOrder",
        order
    );

};

// ======================================================
// SERVIDOR
// ======================================================

server.listen(port, () => {

    console.log(
        `Servidor rodando na porta ${port}`
    );

    console.log(
        `Produtos: http://localhost:${port}/api/foods`
    );

    console.log(
        `Categorias: http://localhost:${port}/category/get-category`
    );

    console.log(
        `Uploads: http://localhost:${port}/uploads/`
    );

});
