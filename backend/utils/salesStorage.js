import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const salesFile = path.join(__dirname, "../data/sales.json");

export const getSales = () => {
    if (!fs.existsSync(salesFile)) {
        fs.writeFileSync(salesFile, "[]");
    }

    const data = fs.readFileSync(salesFile, "utf8");

    return JSON.parse(data);
};

export const saveSales = (sales) => {
    fs.writeFileSync(
        salesFile,
        JSON.stringify(sales, null, 2)
    );
};