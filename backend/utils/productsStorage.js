import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/products.json");

// Leer productos
export const getProducts = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }

    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);

  } catch (error) {
    console.error("Error leyendo products.json:", error);
    return [];
  }
};

// Guardar productos
export const saveProducts = (products) => {
  try {
    fs.writeFileSync(
      filePath,
      JSON.stringify(products, null, 2),
      "utf8"
    );

    return true;

  } catch (error) {
    console.error("Error guardando products.json:", error);
    return false;
  }
};