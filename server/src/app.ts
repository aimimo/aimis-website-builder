// Express app setup
import express from "express";
import cors from "cors";
import { pool } from "./database";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/status", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = 1");
        res.json({ name: result.rows[0].name });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            status: "error",
            database: "not connected",
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})