import db from "../db.js";

// Obtener un negocio
export const getBusiness = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            `
            SELECT
                id_negocio,
                nombre_negocio,
                propietario,
                telefono,
                correo
            FROM negocios
            WHERE id_negocio = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Negocio no encontrado."
            });
        }

        res.json({
            success: true,
            business: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo negocio"
        });

    }

};


// Actualizar negocio
export const updateBusiness = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            nombre,
            telefono,
            correo
        } = req.body;

        await db.query(
            `
            UPDATE negocios
            SET
                nombre = ?,
                telefono = ?,
                correo = ?
            WHERE id_negocio = ?
            `,
            [
                nombre,
                telefono,
                correo,
                id
            ]
        );

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error actualizando negocio"
        });

    }

};