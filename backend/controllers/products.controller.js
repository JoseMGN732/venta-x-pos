import { getProducts, saveProducts } from "../utils/productsStorage.js";

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
export const createProduct = (req, res) => {
  try {
    const products = getProducts();

    const newProduct = {
      id: Date.now(),
      ...req.body,
    };

    products.push(newProduct);

    saveProducts(products);

    res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
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