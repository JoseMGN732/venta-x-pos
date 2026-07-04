import pool from "../db.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { username, password, uuid } = req.body;

    // 1. Usuario
    const [users] = await pool.query(
      "SELECT * FROM usuarios_pos WHERE usuario = ? AND activo = 1",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const user = users[0];

    // 2. Password
    const okPassword = await bcrypt.compare(password, user.password_hash);

    if (!okPassword) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    // 3. Licencia del negocio
    const [licencia] = await pool.query(
      "SELECT * FROM licencias WHERE id_negocio = ?",
      [user.id_negocio]
    );

    // Verificar existencia
    if (licencia.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No existe una licencia para este negocio."
      });
    }

    const licenciaActual = licencia[0];

    // Verificar estado
    if (licenciaActual.estado === "SUSPENDIDA") {
      return res.status(403).json({
        success: false,
        message: "La licencia se encuentra suspendida. Contacte al administrador."
      });
    }

    // Verificar fecha de vencimiento
    const hoy = new Date();
    const fechaVencimiento = new Date(licenciaActual.fecha_vencimiento);

    if (fechaVencimiento < hoy) {
      return res.status(403).json({
        success: false,
        message: "La licencia ha vencido."
      });
    }

    // Cualquier otro estado diferente de ACTIVA
    if (licenciaActual.estado !== "ACTIVA") {
      return res.status(403).json({
        success: false,
        message: "La licencia no se encuentra activa."
      });
    }

    const idLicencia = licencia[0].id_licencia;

    // 4. DISPOSITIVO (MODO ESTRICTO)
    const [device] = await pool.query(
      `SELECT * FROM dispositivos_pos 
       WHERE id_licencia = ? 
       AND uuid_equipo = ? 
       AND activo = 1`,
      [idLicencia, uuid]
    );

    if (device.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Dispositivo no autorizado"
      });
    }

    // 5. OK LOGIN
    return res.json({
      success: true,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        usuario: user.usuario,
        rol: user.rol,
        negocioId: user.id_negocio
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error interno"
    });
  }
};