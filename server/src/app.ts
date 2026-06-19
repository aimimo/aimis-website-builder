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
            "SELECT * FROM user_account ORDER BY id"
        );

        res.json({ users: result.rows });
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.get("/sites", async (_req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM site ORDER BY id"
        );

        res.json({ sites: result.rows });
    } catch (err) {
        console.error("Error fetching site data:", err);
        res.status(500).json({ error: "Failed to fetch site data" });
    }
});

app.get("/pages", async (_req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM page ORDER BY created_at DESC"
        );

        res.json({ pages: result.rows });
    } catch (err) {
        console.error("Error fetching pages:", err);
        res.status(500).json({ error: "Failed to fetch pages" });
    }
});

app.post("/pages", async (req, res) => {
    try {
        const { title, site_id, slug, content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "content is required" });
        }

        const result = await pool.query(
            `
            INSERT INTO page (title, site_id, slug, content)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [title, site_id, slug, JSON.stringify(content)]
        );

        res.status(201).json({ page: result.rows[0] });
    } catch (err) {
        console.error("Error creating page:", err);
        res.status(500).json({ error: "Failed to create page" });
    }
});

app.get("/pages/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;

        const result = await pool.query(
            "SELECT * FROM page WHERE slug = $1",
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Page not found" });
        }

        res.json( result.rows[0] );
    } catch (err) {
        console.error("Error fetching page:", err);
        res.status(500).json({ error: "Failed to fetch page" });
    }       
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
