// Express app setup
import express from "express";
import cors from "cors";
import { pool } from "./database";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/users", async (_req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users ORDER BY id"
        );

        res.json({ users: result.rows });
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.get("/pages", async (_req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM pages ORDER BY created_at DESC"
        );

        res.json({ pages: result.rows });
    } catch (err) {
        console.error("Error fetching pages:", err);
        res.status(500).json({ error: "Failed to fetch pages" });
    }
});

app.post("/pages", async (req, res) => {
    try {
        const { title, slug, content } = req.body;

        const result = await pool.query(
            `
            INSERT INTO pages (title, slug, content)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [title, slug, content]
        );

        res.status(201).json({ page: result.rows[0] });
    } catch (err) {
        console.error("Error creating page:", err);
        res.status(500).json({ error: "Failed to create page" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
