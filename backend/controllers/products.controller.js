import { getProducts, saveProducts } from "../utils/productsStorage.js";
import { getMovements, saveMovements } from "../utils/movementsStorage.js";

// Obtener todos los productos
export const getAllProducts = (req, res) => {
  try {
    const products = getProducts();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo productos",
    });
  }
};

  // Crear producto
  // Crear producto
  export const createProduct = (req, res) => {
    try {
      const products = getProducts();

      const newProduct = {
        id: Date.now().toString(),
        ...req.body,
      };

      products.push(newProduct);

      // Guardar producto
      saveProducts(products);

      // Registrar movimiento de stock inicial
      const stockInicial = Number(newProduct.stock) || 0;

      if (stockInicial > 0) {
        const movements = getMovements();

        const now = new Date();

        const fecha =
          now.getFullYear() +
          "-" +
          String(now.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(now.getDate()).padStart(2, "0");

        const movimiento = {
          id: Date.now().toString() + "-INICIAL",

          negocioId: newProduct.negocioId,

          productoId: newProduct.id,

          producto: newProduct.nombre,

          tipo: "entrada",

          cantidad: stockInicial,

          stockAnterior: 0,

          stockNuevo: stockInicial,

          motivo: "Stock inicial",

          usuario: req.body.usuario || "Administrador",

          fecha,

          hora: now.toLocaleTimeString("es-MX", {
            hour12: false,
          }),
        };

        movements.push(movimiento);

        saveMovements(movements);
      }

      res.status(201).json({
        success: true,
        product: newProduct,
      });

    } catch (error) {

      console.error("Error creando producto:", error);

      res.status(500).json({
        success: false,
        message: "Error creando producto",
      });
    }
  };

// Actualizar producto
export const updateProduct = (req, res) => {
  try {
    const id = req.params.id;

    const products = getProducts();

    const index = products.findIndex((p) => String(p.id) === String(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    products[index] = {
      ...products[index],
      ...req.body,
    };

    saveProducts(products);

    res.json({
      success: true,
      product: products[index],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error actualizando producto",
    });
  }
};

// Eliminar producto
export const deleteProduct = (req, res) => {
  try {
    const id = req.params.id;

    let products = getProducts();

    const existe = products.some((p) => String(p.id) === String(id));

    if (!existe) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    products = products.filter((p) => String(p.id) !== String(id));

    saveProducts(products);

    res.json({
      success: true,
      message: "Producto eliminado",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error eliminando producto",
    });
  }
};