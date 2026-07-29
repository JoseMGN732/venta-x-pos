import express from "express";

import {
    getAllSales,
    createSale
} from "../controllers/sales.controller.js";

const router = express.Router();

router.get("/", getAllSales);

router.post("/", createSale);

export default router;