import { getMovements, saveMovements } from "../utils/movementsStorage.js";
import { getProducts, saveProducts } from "../utils/productsStorage.js";

// Obtener todos los movimientos
export const getAllMovements = (req, res) => {

    try {

        const movements = getMovements();

        res.json({
            success: true,
            movements
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error obteniendo movimientos"
        });

    }

};

// Registrar un movimiento
export const createMovement = (req, res) => {

    try {

        const {
            productoId,
            tipo,
            cantidad,
            motivo,
            usuario
        } = req.body;

        const products = getProducts();

        const product = products.find(
            p => Number(p.id) === Number(productoId)
        );

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });

        }

        const stockAnterior = product.stock;

        let stockNuevo = stockAnterior;

        if (tipo === "entrada") {

            stockNuevo += Number(cantidad);

        } else if (tipo === "salida") {

            stockNuevo -= Number(cantidad);

            if (stockNuevo < 0) {

                return res.status(400).json({
                    success: false,
                    message: "Stock insuficiente"
                });

            }

        }

        product.stock = stockNuevo;

        saveProducts(products);

        const movements = getMovements();

        const now = new Date();

        const movement = {
            id: Date.now(),
            productoId: product.id,
            producto: product.nombre,
            tipo,
            cantidad: Number(cantidad),
            stockAnterior,
            stockNuevo,
            motivo,
            usuario,
            fecha: now.toISOString().split("T")[0],
            hora: now.toLocaleTimeString("es-MX")
        };

        movements.push(movement);

        saveMovements(movements);

        res.status(201).json({
            success: true,
            movement
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error registrando movimiento"
        });

    }

};

// Eliminar movimiento
export const deleteMovement = (req, res) => {

    try {

        const id = Number(req.params.id);

        let movements = getMovements();

        const existe = movements.some(m => m.id === id);

        if (!existe) {

            return res.status(404).json({
                success: false,
                message: "Movimiento no encontrado"
            });

        }

        movements = movements.filter(m => m.id !== id);

        saveMovements(movements);

        res.json({
            success: true,
            message: "Movimiento eliminado"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error eliminando movimiento"
        });

    }

};