import express from "express";

import {
    getAllMovements,
    createMovement,
    deleteMovement
} from "../controllers/movements.controller.js";

const router = express.Router();

// Obtener historial
router.get("/", getAllMovements);

// Registrar movimiento
router.post("/", createMovement);

// Eliminar movimiento
router.delete("/:id", deleteMovement);

export default router;