import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GridLayout, { type Layout } from "react-grid-layout";

import {
  useGetPagesQuery,
  useAddSectionMutation,
  useDeleteSectionMutation,
  useAddTextBlockMutation,
  useUpdateTextBlockMutation,
  useUpdateBlockLayoutMutation,
  useUpdateSectionMutation,
  useUpdatePageMutation,
  useGetTourStepsQuery,
  useUpdateTourStepsMutation,
} from "../services/api";

import RichTextEditor from "../components/RichTextEditor";
import WelcomeModal from "../components/WelcomeModal";
import GettingStartedHero from "../components/GettingStartedHero";
import PracticePath from "../components/PracticePath";
import GettingStartedTour from "../components/GettingStartedTour";
import TourStepsEditor from "../components/TourStepsEditor";

import "../styles/PageDetail.css";

type PageDetailProps = {
  role: "user" | "admin";
};

function PageDetail({ role }: PageDetailProps) {
  const { pageId } = useParams<{ pageId: string }>();
  const [searchParams] = useSearchParams();
  const activeSectionId = searchParams.get("section");
  const { data: pages, isLoading, refetch } = useGetPagesQuery();
  const [addSection] = useAddSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [addTextBlock] = useAddTextBlockMutation();
  const [updateTextBlock] = useUpdateTextBlockMutation();
  const [updateBlockLayout] = useUpdateBlockLayoutMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [updatePage] = useUpdatePageMutation();
  const [updateTourSteps] = useUpdateTourStepsMutation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const page = pages?.find((p) => p.id === pageId) ?? pages?.[0];

  const { data: tourSteps = [] } = useGetTourStepsQuery(
    { pageId: page?.id ?? "" },
    { skip: !page }
  );

  useEffect(() => {
    if (!page) return;
    if (role !== "user") return;
    if (page.id === "getting-started") {
      setShowWelcome(true);
      setRunTour(true);
    } else {
      setShowWelcome(false);
      setRunTour(false);
    }
  }, [page?.id, role]);

  if (isLoading || !pages) return <div>Loading…</div>;
  if (!page) return <div>Page not found</div>;

  return (
    <>
      {/* USER TOUR */}
      {role === "user" && page.id === "getting-started" && (
        <GettingStartedTour
          run={runTour}
          steps={tourSteps}
          onFinish={() => setRunTour(false)}
        />
      )}
      {/* WELCOME */}
      <WelcomeModal
        open={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
      <div className={`page-detail ${role}`}>
        {/* PAGE TITLE */}
        {role === "admin" ? (
          <input
            value={page.title}
            onChange={(e) =>
              updatePage({ pageId: page.id, title: e.target.value })
            }
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              border: "none",
              background: "transparent",
              width: "100%",
              marginBottom: 16,
            }}
          />
        ) : (
          page.id !== "getting-started" && <h2>{page.title}</h2>
        )}
        {/* ADMIN: EDIT TOUR */}
        {role === "admin" && page.id === "getting-started" && (
          <TourStepsEditor
            steps={tourSteps}
            onSave={(steps) => updateTourSteps({ steps })}
          />
        )}
        {/* USER EXPERIENCE */}
        {role === "user" && page.id === "getting-started" && (
          <>
            <GettingStartedHero />
            <PracticePath />
          </>
        )}
        {/* ADD SECTION */}
        {role === "admin" && (
          <button
            onClick={async () => {
              await addSection({ pageId: page.id, title: "New section" });
              refetch();
            }}
          >
            Add section
          </button>
        )}
        {page.sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const blocks = section.blocks.filter((b) => b.type === "text");
          const layout: Layout[] = blocks.map((block) => ({
            i: block.id,
            x: block.layout.x,
            y: block.layout.y,
            w: block.layout.w,
            h: block.layout.h,
          }));
          return (
            <div
              key={section.id}
              className={`card ${isActive ? "active" : ""}`}
            >
              {role === "admin" ? (
                <input
                  value={section.title}
                  onChange={(e) =>
                    updateSection({
                      pageId: page.id,
                      sectionId: section.id,
                      title: e.target.value,
                    })
                  }
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    marginBottom: 12,
                  }}
                />
              ) : (
                <h3>{section.title}</h3>
              )}
              {role === "admin" && (
                <button
                  onClick={async () => {
                    await addTextBlock({
                      pageId: page.id,
                      sectionId: section.id,
                      content: "<p>Start writing…</p>",
                    });
                    refetch();
                  }}
                >
                  Add block
                </button>
              )}

              {blocks.length > 0 && (
                <GridLayout
                  className="text-grid"
                  layout={layout}
                  cols={12}
                  rowHeight={30}
                  width={800}
                  isDraggable={role === "admin"}
                  isResizable={role === "admin"}
                  resizeHandles={role === "admin" ? ["se"] : []}
                  draggableHandle=".block-drag-handle"
                  draggableCancel=".editor-content, input, textarea, button"
                  margin={[12, 12]}
                  onLayoutChange={
                    role === "admin"
                      ? (currentLayout) =>
                          currentLayout.forEach((item) =>
                            updateBlockLayout({
                              pageId: page.id,
                              sectionId: section.id,
                              blockId: item.i,
                              layout: {
                                x: item.x,
                                y: item.y,
                                w: item.w,
                                h: item.h,
                              },
                            })
                          )
                      : undefined
                  }
                >
                  {blocks.map((block) => (
                    <div key={block.id} className="text-block">
                      {role === "admin" && (
                        <div className="block-drag-handle">
                          ⠿ Move block
                        </div>
                      )}
                      <div
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <RichTextEditor
                          value={block.content}
                          editable={role === "admin"}
                          onChange={(html) =>
                            updateTextBlock({
                              pageId: page.id,
                              sectionId: section.id,
                              blockId: block.id,
                              content: html,
                              imageUrl: block.imageUrl,
                            })
                          }
                        />
                      </div>

                      {block.imageUrl && (
                        <img src={block.imageUrl} alt="" />
                      )}
                      {role === "admin" && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            id={`upload-${block.id}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () =>
                                updateTextBlock({
                                  pageId: page.id,
                                  sectionId: section.id,
                                  blockId: block.id,
                                  content: block.content,
                                  imageUrl: reader.result as string,
                                });
                              reader.readAsDataURL(file);
                            }}
                          />
                          <button
                            onClick={() =>
                              document
                                .getElementById(`upload-${block.id}`)
                                ?.click()
                            }
                          >
                            {block.imageUrl
                              ? "Replace image"
                              : "Upload image"}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </GridLayout>
              )}
              {role === "admin" && (
                <button
                  onClick={() =>
                    deleteSection({
                      pageId: page.id,
                      sectionId: section.id,
                    })
                  }
                >
                  Delete section
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default PageDetail;
