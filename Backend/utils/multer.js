
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ======================================================
// __dirname
// ======================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// PASTA DE UPLOADS
// ======================================================
//
// Estrutura:
// Backend/
// ├── config/
// │   └── multer.js
// └── uploads/
//
// O ".." volta de config para Backend.
//

const uploadDir = path.join(__dirname, "..", "uploads");

// Cria a pasta caso não exista
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

// ======================================================
// STORAGE
// ======================================================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, uploadDir);

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// ======================================================
// MULTER
// ======================================================

const upload = multer({
    storage
});

// ======================================================
// EXPORT
// ======================================================

export default upload;
export { upload };

