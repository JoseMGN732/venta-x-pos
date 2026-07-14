import express from "express";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

// Obtener todos
router.get("/", getAllProducts);

// Crear
router.post("/", createProduct);

// Actualizar
router.put("/:id", updateProduct);

// Eliminar
router.delete("/:id", deleteProduct);

export default router;