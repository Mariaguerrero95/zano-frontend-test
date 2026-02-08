import "../styles/Sidebar.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useDeletePageMutation,
  useAddSectionMutation,
  useDeleteSectionMutation,
} from "../services/api";

type SidebarProps = {
  role: "user" | "admin";
};

function Sidebar({ role }: SidebarProps) {
  const { data: pages, isLoading } = useGetPagesQuery();
  const [newPageTitle, setNewPageTitle] = useState("");
  const [search, setSearch] = useState("");
  const [openPageId, setOpenPageId] = useState<string | null>(null);

  const [createPage] = useCreatePageMutation();
  const [deletePage] = useDeletePageMutation();
  const [addSection] = useAddSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();

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
        <Link to="/">Asana Atlas</Link>
      </h1>
      <p className="sidebar-subtitle">Yoga Knowledge Base</p>

      {/* SEARCH */}
      <input
        className="sidebar-search"
        type="text"
        placeholder="Search guides..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CREATE PAGE */}
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
      {/* PAGES */}
      <ul className="sidebar-list">
        {filteredPages?.map((page) => {
          const isOpen = openPageId === page.id;
          return (
            <li key={page.id}>
              {/* PAGE ROW */}
              <div
            className="sidebar-item"
            onClick={() => setOpenPageId(isOpen ? null : page.id)}
          >
            <span>{page.title}</span>
            {page.sections.length > 0 && (
              <span
                className={`sidebar-arrow ${isOpen ? "open" : ""}`}
              >
                ▾
              </span>
            )}
                {role === "admin" && (
                  <button
                    className="delete-page"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          "Delete this page and all subpages?"
                        )
                      ) {
                        deletePage({ pageId: page.id });
                      }
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              {/* SUBPAGES */}
              {isOpen && (
                <ul className="sidebar-sublist">
                  {page.sections.map((section) => (
                    <li key={section.id} className="sidebar-subitem-row">
                      <Link
                        to={`/pages/${page.id}?section=${section.id}`}
                        className="sidebar-subitem"
                      >
                        {section.title}
                      </Link>
                      {role === "admin" && (
                        <button
                          className="delete-page"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Delete this subpage?"
                              )
                            ) {
                              deleteSection({
                                pageId: page.id,
                                sectionId: section.id,
                              });
                            }
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                  {/* ADD SUBPAGE */}
                  {role === "admin" && (
                    <li>
                      <button
                        className="sidebar-add-section"
                        onClick={() =>
                          addSection({
                            pageId: page.id,
                            title: "New subpage",
                          })
                        }
                      >
                        + Add subpage
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
