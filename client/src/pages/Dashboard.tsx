import { useEffect, useState } from "react";
import { getPages, getPageBySlug, createPage } from "../api/pages";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/react";

function ContentEditor({
  content,
  onChange,
}: {
  content: JSONContent;
  onChange: (json: JSONContent) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  return <EditorContent editor={editor} />;
}

export default function Dashboard() {
  const [pages, setPages] = useState<any[]>([]);
  const [testPage, setTestPage] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [site_id, setSiteId] = useState<number>(0);
  const [content, setContent] = useState<JSONContent>({
    type: "doc",
    content: [],
  });

  const loadTestPage = async () => {
    const data = await getPageBySlug("tiptaptest");
    setTestPage(data);
  };

  function PublicPageView({
    pageData,
  }: {
    pageData: { contentHtml: string } | null;
  }) {
    if (!pageData) return null; // necessary to avoid trying to render before data is loaded
    return <div dangerouslySetInnerHTML={{ __html: pageData.contentHtml }} />;
  }

  const loadPages = async () => {
    const data = await getPages();
    setPages(data);
  };

  useEffect(() => {
    loadPages();
    loadTestPage();
  }, []);

  const handleCreate = async () => {
    await createPage({ title, site_id: site_id, slug, content });
    setTitle("");
    setSiteId(0);
    setSlug("");
    setContent({ type: "doc", content: [] });
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
        <ContentEditor content={content} onChange={setContent} />
        <button onClick={handleCreate}>Create Page</button>
      </div>

      <hr />

      <ul>
        {pages.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong> at /{p.slug}
            <p>{p.content?.content[0]?.content[0]?.text}</p>
          </li>
        ))}
        <li>
          <PublicPageView pageData={testPage} />
        </li>
      </ul>
    </div>
  );
}
