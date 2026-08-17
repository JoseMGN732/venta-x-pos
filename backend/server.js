import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import movementsRoutes from "./routes/movements.routes.js";
import usersRoutes from "./routes/users.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import businessRoutes from "./routes/business.routes.js";
import { connectPrinter, printTest } from "./services/printer.service.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/movements", movementsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/business", businessRoutes);

// Prueba de impresora térmica
app.get("/api/printer/test", async (req, res) => {

  try {

    const connected = await connectPrinter();

    if (!connected) {
      return res.status(500).json({
        success: false,
        message: "No se pudo conectar con la impresora"
      });
    }

    await printTest();

    res.json({
      success: true,
      message: "Prueba de impresión enviada correctamente"
    });

  } catch (error) {

    console.error("Error imprimiendo:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

app.get("/", (req, res) => {
  res.json({ status: "Venta X Backend OK" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});