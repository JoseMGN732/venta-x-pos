import { SerialPort } from "serialport";

const PORT = "COM3";
const BAUD_RATE = 9600;

let printer = null;

export const connectPrinter = async () => {

    try {

        // Si ya existe una conexión abierta, reutilizarla
        if (printer && printer.isOpen) {

            console.log(`🖨️ Impresora ya conectada en ${PORT}`);

            return true;

        }

        // Si existe una instancia anterior pero está cerrada,
        // intentar abrirla nuevamente
        if (printer && !printer.isOpen) {

            await new Promise((resolve, reject) => {

                printer.open((error) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();

                });

            });

            console.log(`🖨️ Impresora reconectada en ${PORT}`);

            return true;

        }

        // Crear una nueva conexión
        printer = new SerialPort({

            path: PORT,

            baudRate: BAUD_RATE,

            autoOpen: false

        });

        await new Promise((resolve, reject) => {

            printer.open((error) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve();

            });

        });

        console.log(`🖨️ Impresora conectada en ${PORT}`);

        return true;

    } catch (error) {

        console.error(
            "❌ Error conectando impresora:",
            error.message
        );

        printer = null;

        return false;

    }

};

export const printTest = async () => {

    if (!printer || !printer.isOpen) {
        throw new Error("La impresora no está conectada");
    }

    const text =
        "\x1B\x40" +
        "PRUEBA SYNKRO POS\n" +
        "Impresora NE-510X\n" +
        "Conexion COM3 OK\n" +
        "\n\n\n";

    await new Promise((resolve, reject) => {

        printer.write(text, (error) => {

            if (error) {
                reject(error);
                return;
            }

            printer.drain((error) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve();

            });

        });

    });

};

export const printTicket = async (sale, business) => {

    if (!printer || !printer.isOpen) {
        throw new Error("La impresora no está conectada");
    }

    const moneda = business?.config?.moneda || "$";
    const nombreNegocio = business?.config?.info?.nombre || "SYNKRO POS";
    const direccion = business?.config?.info?.direccion || "";
    const telefono = business?.config?.info?.telefono || "";

    let ticket = "";

    // Inicializar impresora
    ticket += "\x1B\x40";

    // Centrar
    ticket += "\x1B\x61\x01";

    ticket += `${nombreNegocio}\n`;

    if (direccion) {
        ticket += `${direccion}\n`;
    }

    if (telefono) {
        ticket += `Tel: ${telefono}\n`;
    }

    ticket += "--------------------------------\n";

    // Alinear izquierda
    ticket += "\x1B\x61\x00";

    ticket += `TICKET: ${String(sale.id).slice(-6)}\n`;
    ticket += `FECHA: ${sale.fecha}\n`;
    ticket += `HORA: ${sale.hora}\n`;
    ticket += `CAJERO: ${sale.cajero}\n`;

    ticket += "--------------------------------\n";

    ticket += "PRODUCTO       CANT       TOTAL\n";
    ticket += "--------------------------------\n";

    for (const item of sale.items) {

        let nombre = item.nombre || "";

        // Limitar nombre para evitar desbordar el papel
        if (nombre.length > 17) {
            nombre = nombre.substring(0, 17);
        }

        const cantidad = String(item.cantidad);
        const total = `${moneda}${item.subtotal.toFixed(2)}`;

        ticket += `${nombre}\n`;
        ticket += `                 ${cantidad}    ${total}\n`;

    }

    ticket += "--------------------------------\n";

    ticket += `SUBTOTAL:       ${moneda}${sale.subtotal.toFixed(2)}\n`;
    ticket += `IVA:            ${moneda}${sale.impuesto.toFixed(2)}\n`;
    ticket += `TOTAL:          ${moneda}${sale.total.toFixed(2)}\n`;

    ticket += "--------------------------------\n";

    ticket += `PAGO: ${sale.metodoPago}\n`;

    ticket += "\n";

    ticket += "\x1B\x61\x01";
    ticket += "¡Gracias por su compra!\n";
    ticket += "\n\n\n";

    await new Promise((resolve, reject) => {

        printer.write(ticket, (error) => {

            if (error) {
                reject(error);
                return;
            }

            printer.drain((error) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve();

            });

        });

    });

};

export const disconnectPrinter = async () => {

    if (!printer) {
        return;
    }

    if (!printer.isOpen) {
        printer = null;
        return;
    }

    await new Promise((resolve) => {

        printer.close((error) => {

            if (error) {
                console.error(
                    "⚠️ Error cerrando impresora:",
                    error.message
                );
            }

            resolve();

        });

    });

    printer = null;

    console.log("🖨️ Impresora desconectada correctamente");

};