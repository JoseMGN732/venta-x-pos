import { SerialPort } from "serialport";

const PORT = "COM3";
const BAUD_RATE = 9600;

let printer = null;

export const connectPrinter = async () => {
    try {

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

        console.error("❌ Error conectando impresora:", error.message);

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