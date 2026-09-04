import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Define __dirname manualmente
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Caminho para o diretório de uploads
const uploadDir = path.join(__dirname, 'Uploads');

// Verifica se a pasta 'Uploads' existe; caso contrário, cria-a
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Define o diretório corretamente
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Gera um nome único para o arquivo
    }
});

const upload = multer({ storage: storage });

// Exporta o middleware para uso nas rotas
export { upload };
