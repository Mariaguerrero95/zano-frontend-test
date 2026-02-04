import { Link } from "react-router-dom";
import { useGetPagesQuery } from "../services/api";

function Sidebar() {
    const { data: pages, isLoading } = useGetPagesQuery();

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
        <h3>Pages</h3>

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
