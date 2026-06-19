import { useEffect, useState } from "react";
import { getPages, createPage } from "../api/pages";

export default function Dashboard() {
    const [pages, setPages] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [site_id, setSiteId] = useState<number>(0);
    const [content, setContent] = useState("");

    const loadPages = async () => {
        const data = await getPages();
        setPages(data);
        console.log("Loaded pages:", data);
    };

    useEffect(() => {
        loadPages();
    }, []);

    const handleCreate = async () => {
        await createPage({ title, site_id: site_id, slug, content });
        setTitle("");
        setSiteId(0);
        setSlug("");
        setContent("");
        loadPages();
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Pages</h1>

            {/* very ugly temporary test */}
            <div style={{ marginBottom: 20 }}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Site ID"
                    value={site_id}
                    onChange={(e) => setSiteId(Number(e.target.value))}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handleCreate}>Create Page</button>
            </div>

            <hr />

            <ul>
                {pages.map((p) => (
                    <li key={p.id}>
                        <strong>{p.title}</strong> at /{p.slug}
                        <p>{p.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}