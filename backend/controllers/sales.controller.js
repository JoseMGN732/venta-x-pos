import { getSales, saveSales } from "../utils/salesStorage.js";
import { getProducts, saveProducts } from "../utils/productsStorage.js";
import { getMovements, saveMovements } from "../utils/movementsStorage.js";

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

        const now = new Date();

        const fecha =
            now.getFullYear() +
            "-" +
            String(now.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(now.getDate()).padStart(2, "0");

        // Verificar existencias
        for (const item of items) {

            const product = products.find(
                p => p.id == item.productId
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
        const movements = getMovements();

        for (const item of items) {

            const product = products.find(
                p => p.id == item.productId
            );

            const stockAnterior = product.stock;

            // descontar inventario
            product.stock -= item.cantidad;

            movements.push({

                id: Date.now().toString() + "-" + product.id,

                negocioId,

                productoId: product.id,

                producto: product.nombre,

                tipo: "salida",

                cantidad: item.cantidad,

                stockAnterior,

                stockNuevo: product.stock,

                motivo: "Venta",

                usuario: cajero,

                fecha,

                hora: now.toLocaleTimeString("es-MX", {
                    hour12: false
                })

            });

        }

        saveMovements(movements);
        saveProducts(products);

        saveMovements(movements);

        saveProducts(products);

        const sales = getSales();

        let ganancia = 0;

        items.forEach(item => {

            const product = products.find(
                p => p.id == item.productId
            );

            if (!product) return;

            // Lo que ganas por una unidad
            const utilidad = product.precioVenta - product.precioCompra;

            // Ganancia total de ese producto
            ganancia += utilidad * item.cantidad;

        });

        const sale = {

            id: "SALE-" + Date.now(),

            negocioId,

            fecha,

            hora: now.toLocaleTimeString("es-MX", {
                hour12: false
            }),

            items,

            subtotal,

            impuesto,

            total,

            ganancia,

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