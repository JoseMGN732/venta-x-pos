import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import movementsRoutes from "./routes/movements.routes.js";
import usersRoutes from "./routes/users.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import businessRoutes from "./routes/business.routes.js";
import {
  connectPrinter,
  printTest,
  printTicket,
  disconnectPrinter
} from "./services/printer.service.js";
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

app.post("/api/printer/ticket", async (req, res) => {

  try {

    const { sale, business } = req.body;

    if (!sale) {
      return res.status(400).json({
        success: false,
        message: "No se recibió la venta"
      });
    }

    // Verificar/conectar la impresora
    const connected = await connectPrinter();

    if (!connected) {
      return res.status(500).json({
        success: false,
        message: "No se pudo conectar con la impresora"
      });
    }

    // Imprimir ticket
    await printTicket(sale, business);

    res.json({
      success: true,
      message: "Ticket impreso correctamente"
    });

  } catch (error) {

    console.error("Error imprimiendo ticket:", error);

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

app.listen(PORT, async () => {

  console.log(`Servidor en http://localhost:${PORT}`);

  const connected = await connectPrinter();

  if (connected) {

    console.log("🖨️ Impresora térmica lista para imprimir");

  } else {

    console.log("⚠️ Impresora no disponible al iniciar el servidor");

  }

});

const shutdown = async () => {

  console.log("🛑 Cerrando servidor...");

  await disconnectPrinter();

  process.exit(0);

};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);