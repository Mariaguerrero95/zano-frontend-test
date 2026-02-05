import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetPagesQuery,useCreatePageMutation,} from "../services/api";

type SidebarProps = {
  role: "user" | "admin";
};

function Sidebar({ role }: SidebarProps) {
    const { data: pages, isLoading } = useGetPagesQuery();
    const [newPageTitle, setNewPageTitle] = useState("");
    const [createPage] = useCreatePageMutation();

    if (isLoading) {
        return <div>Loading pages...</div>;
    }

    return (
        <aside
        style={{
            width: 240,
            padding: 16,
            borderRight: "1px solid #ddd",
        }}
        >
        <h3>
            <Link to="/">Pages</Link>
        </h3>

        {role === "admin" && (
            <div style={{ marginBottom: 16 }}>
            <input
                type="text"
                placeholder="Page title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
                style={{ width: "100%", marginBottom: 8 }}
            />
            <button
                onClick={() => {
                if (!newPageTitle.trim()) return;
                createPage({ title: newPageTitle });
                setNewPageTitle("");
                }}
                style={{ width: "100%" }}
            >
                Add page
            </button>
            </div>
        )}

        <ul style={{ listStyle: "none", padding: 0 }}>
            {pages?.map((page) => (
            <li key={page.id} style={{ marginBottom: 8 }}>
                <Link to={`/pages/${page.id}`}>{page.title}</Link>
            </li>
            ))}
        </ul>
        </aside>
    );
}

export default Sidebar;
