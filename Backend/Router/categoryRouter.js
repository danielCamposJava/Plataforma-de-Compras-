
import express from 'express';

import {
    createCategory,
    deleteCategory,
    getAllCategories,
    renameCategory
} from '../Controller/categoryController.js';

import { upload } from '../utils/multer.js';

const router = express.Router();

router.delete('/delete-category/:id', deleteCategory);

router.get('/get-category', getAllCategories);

router.put('/update-category', renameCategory);

router.post(
    '/create-category',
    upload.single('image'),
    createCategory
);

export default router;
