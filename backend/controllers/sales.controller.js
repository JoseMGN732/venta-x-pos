import { getSales, saveSales } from "../utils/salesStorage.js";
import { getProducts, saveProducts } from "../utils/productsStorage.js";

// Obtener ventas
export const getAllSales = (req, res) => {

    try {

        const sales = getSales();

        res.json({
            success: true,
            sales
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo ventas"
        });

    }

};

// Registrar venta
export const createSale = (req, res) => {

    try {

        const {
            items,
            subtotal,
            impuesto,
            total,
            metodoPago,
            cajero,
            negocioId
        } = req.body;

        const products = getProducts();

        // Verificar existencias
        for (const item of items) {

            const product = products.find(
                p => Number(p.id) === Number(item.productId)
            );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message: `Producto ${item.nombre} no encontrado`
                });

            }

            if (product.stock < item.cantidad) {

                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${product.nombre}`
                });

            }

        }

        // Descontar inventario
        for (const item of items) {

            const product = products.find(
                p => Number(p.id) === Number(item.productId)
            );

            product.stock -= item.cantidad;

        }

        saveProducts(products);

        const sales = getSales();

        const now = new Date();

        const sale = {

            id: "SALE-" + Date.now(),

            negocioId,

            fecha: now.toISOString().split("T")[0],

            hora: now.toLocaleTimeString("es-MX"),

            items,

            subtotal,

            impuesto,

            total,

            metodoPago,

            cajero

        };

        sales.push(sale);

        saveSales(sales);

        res.status(201).json({

            success: true,

            sale

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Error registrando venta"

        });

    }

};