import "../styles/Sidebar.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useDeletePageMutation,
} from "../services/api";


type SidebarProps = {
  role: "user" | "admin";
};

function Sidebar({ role }: SidebarProps) {
  const { data: pages, isLoading } = useGetPagesQuery();
  const [newPageTitle, setNewPageTitle] = useState("");
  const [search, setSearch] = useState("");

  const [createPage] = useCreatePageMutation();
  const [deletePage] = useDeletePageMutation();

  const location = useLocation();

  if (isLoading) {
    return <aside className="sidebar">Loading pages…</aside>;
  }

  const filteredPages = pages?.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <h1 className="sidebar-title">
        <Link to="/">Zano Help Center</Link>
      </h1>

      {/* 🔍 SEARCH */}
      <input
        className="sidebar-search"
        type="text"
        placeholder="Search guides..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ➕ CREATE PAGE (ADMIN ONLY) */}
      {role === "admin" && (
        <div className="sidebar-create">
          <input
            className="sidebar-input"
            type="text"
            placeholder="New page title"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
          />
          <button
            className="primary-button"
            onClick={() => {
              if (!newPageTitle.trim()) return;
              createPage({ title: newPageTitle });
              setNewPageTitle("");
            }}
          >
            + Add page
          </button>
        </div>
      )}

      {/* 📄 PAGES */}
      <ul className="sidebar-list">
        {filteredPages?.map((page) => {
          const isActive = location.pathname === `/pages/${page.id}`;

          return (
            <li key={page.id} className="sidebar-item">
              <Link
                to={`/pages/${page.id}`}
                className={isActive ? "active" : ""}
              >
                {page.title}
              </Link>

              {role === "admin" && (
                <button
                  className="delete-page"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this page?"
                    );
                    if (!confirmed) return;
                    deletePage({ pageId: page.id });
                  }}
                  title="Delete page"
                >
                  ✕
                </button>
              )}
            </li>
          );
        })}

        {filteredPages?.length === 0 && (
          <li className="sidebar-empty">No results found</li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
