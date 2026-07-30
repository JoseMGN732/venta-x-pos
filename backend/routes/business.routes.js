import express from "express";

import {
    getBusiness,
    updateBusiness
} from "../controllers/business.controller.js";

const router = express.Router();

router.get("/:id", getBusiness);

router.put("/:id", updateBusiness);

export default router;