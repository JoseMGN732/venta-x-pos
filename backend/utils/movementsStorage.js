import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/movements.json");

export const getMovements = () => {

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }

    const data = fs.readFileSync(filePath);

    return JSON.parse(data);

};

export const saveMovements = (movements) => {

    fs.writeFileSync(
        filePath,
        JSON.stringify(movements, null, 2)
    );

};