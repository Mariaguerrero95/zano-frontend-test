import "../styles/Sidebar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetPagesQuery,
  useCreatePageMutation,
  useDeletePageMutation,
  useAddSectionMutation,
  useDeleteSectionMutation,
  useGetUiSettingsQuery,
  useUpdateSidebarAudioMutation,
} from "../services/api";
import SidebarAudioPlayer from "./SidebarAudioPlayer";
import relaxAudio from "../assets/relax.wav";

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

  const { data: uiSettings } = useGetUiSettingsQuery();
  const [updateSidebarAudio] = useUpdateSidebarAudioMutation();

  const showAudio = uiSettings?.sidebarAudioEnabled ?? true;

  if (isLoading) {
    return <aside className="sidebar">Loading pages…</aside>;
  }

  const filteredPages = pages?.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      className="sidebar"
      style={{ display: "flex", flexDirection: "column" }}
    >
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
              createPage({
                title: newPageTitle,
                category: "product-guides",
              });
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

              {isOpen && (
                <ul className="sidebar-sublist">
                  {page.sections.map((section) => (
                    <li
                      key={section.id}
                      className="sidebar-subitem-row"
                    >
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

      {/* AUDIO PLAYER */}
      <div style={{ marginTop: "auto" }}>
        {showAudio && (
          <SidebarAudioPlayer
            audioUrl={relaxAudio}
            canDelete={role === "admin"}
            onDelete={() =>
              updateSidebarAudio({ enabled: false })
            }
          />
        )}
        {!showAudio && role === "admin" && (
          <button
            onClick={() =>
              updateSidebarAudio({ enabled: true })
            }
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px dashed #9ca3af",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
            }}
          >
            ➕ Add audio player
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
