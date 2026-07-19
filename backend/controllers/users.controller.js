import db from "../db.js";
import bcrypt from "bcrypt";

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                id_usuario,
                id_negocio,
                nombre,
                usuario,
                rol,
                activo,
                fecha_creacion
            FROM usuarios_pos
            ORDER BY nombre ASC
        `);

        res.json({
            success: true,
            users: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error obteniendo usuarios"
        });

    }

};

// Crear usuario
export const createUser = async (req, res) => {

    console.log(req.body);

    try {

        const {
            id_negocio,
            nombre,
            usuario,
            rol,
            activo,
            password
        } = req.body;

        const [exists] = await db.query(
            "SELECT id_usuario FROM usuarios_pos WHERE usuario = ?",
            [usuario]
        );

        if (exists.length > 0) {

            return res.status(400).json({
                success: false,
                message: "El usuario ya existe."
            });

        }

        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `
            INSERT INTO usuarios_pos
            (
                id_negocio,
                nombre,
                usuario,
                password_hash,
                rol,
                activo
            )
            VALUES
            (?, ?, ?, ?, ?, 1)
            `,
            [
                id_negocio,
                nombre,
                usuario,
                password_hash,
                rol
            ]
        );

        res.status(201).json({
            success: true,
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error creando usuario"
        });

    }

};

// Actualizar usuario
export const updateUser = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            nombre,
            usuario,
            password,
            rol,
            activo
        } = req.body;

        if (password) {

            const password_hash = await bcrypt.hash(password, 10);

            await db.query(
                `
                UPDATE usuarios_pos
                SET
                    nombre=?,
                    usuario=?,
                    password_hash=?,
                    rol=?,
                    activo=?
                WHERE id_usuario=?
                `,
                [
                    nombre,
                    usuario,
                    password_hash,
                    rol,
                    activo,
                    id
                ]
            );

        } else {

            await db.query(
                `
                UPDATE usuarios_pos
                SET
                    nombre=?,
                    usuario=?,
                    rol=?,
                    activo=?
                WHERE id_usuario=?
                `,
                [
                    nombre,
                    usuario,
                    rol,
                    activo,
                    id
                ]
            );

        }

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error actualizando usuario"
        });

    }

};

// Desactivar usuario
export const deleteUser = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(
            `
            UPDATE usuarios_pos
            SET activo = 0
            WHERE id_usuario = ?
            `,
            [id]
        );

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Error eliminando usuario"
        });

    }

};