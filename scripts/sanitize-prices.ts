import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT id, name, price FROM products");
        const products = res.rows;

        console.log(`Found ${products.length} products. Sanitizing prices...`);

        for (const product of products) {
            let cleanPrice = "0";
            if (product.price) {
                // Remove "đ", dots, commas, and any non-numeric characters except for decimal point
                cleanPrice = product.price.replace(/[^\d]/g, "");
            }

            console.log(`Updating ${product.name}: "${product.price}" -> "${cleanPrice}"`);
            await client.query("UPDATE products SET price = $1 WHERE id = $2", [cleanPrice, product.id]);
        }

        console.log("Success: All prices sanitized to numeric strings.");
    } catch (err) {
        console.error("Error sanitizing prices:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
