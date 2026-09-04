import express from 'express';
import {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct
   
} from '../controller/ProductController.js';
import { upload } from '../config/multer.js'; // Middleware de upload
import { getProductById } from '../service/ProductService.js';

const router = express.Router();

// ✅ Criar novo produto (com upload de imagem)
router.post('/', upload.single('image'), createProduct);

// ✅ Buscar todos os produtos
router.get('/', getAllProduct);

// ✅ Buscar produto por ID
router.get('/:id', getProductById);

// ✅ Atualizar produto por ID (com upload opcional de nova imagem)
router.put('/:id', upload.single('image'), updateProduct);

// ✅ Deletar  produto por nome (cuidado: esse tipo de deleção por nome pode ser perigoso se tiver nomes duplicados)
router.delete('/name/:name', deleteProduct);

export default router;
