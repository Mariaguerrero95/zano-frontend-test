import "../styles/PageDetail.css";
import "../styles/MoodFeedbackModal.css";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import GridLayout from "react-grid-layout";
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
import WelcomeModal from "../components/PopupDiscount";
import GettingStartedHero from "../components/GettingStartedHero";
import PracticePath from "../components/PracticePath";
import GettingStartedTour from "../components/GettingStartedTour";
import TourStepsEditor from "../components/TourStepsEditor";
import MoodFeedback from "../components/MoodFeedbackModal";
import type { MoodLevel } from "../types/guide";
import type { TextBlock } from "../types/guide";

type GridItemLayout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
};
type PageDetailProps = {
  role: "user" | "admin";
  onMoodSelected: (mood: MoodLevel) => void;
};


function PageDetail({ role, onMoodSelected }: PageDetailProps) {
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
  const pageIdValue = page?.id;
  const hasShownTour = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const AnyGridLayout = GridLayout as any;
  const { data: tourSteps = [] } = useGetTourStepsQuery(
    { pageId: page?.id ?? "" },
    { skip: !page }
  );

  //* eslint-disable-next-line react-hooks/exhaustive-deps *//
  useEffect(() => {
    if (role !== "user") return;
    if (pageIdValue !== "getting-started") return;
    if (hasShownTour.current) return;
  
    setRunTour(true);
    hasShownTour.current = true;
  }, [pageIdValue, role]);
  
  
  useEffect(() => {
    if (role !== "user") return;
  
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 45000);
  
    return () => clearTimeout(timer);
  }, [role]);
  

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
          const blocks = section.blocks.filter(
            (b): b is TextBlock => b.type === "text"
          );
          
          const layout = blocks.map((block) => ({
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
                <AnyGridLayout
                  className="text-grid"
                  layout={layout}
                  cols={12 as number}
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
                    ? (currentLayout: GridItemLayout[]) =>
                      currentLayout.forEach((item: GridItemLayout) =>                  
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
                </AnyGridLayout>
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
        {role === "user" && page.id === "getting-started" && (
          <MoodFeedback
            pageId={page.id}
            onSelect={onMoodSelected}
          />
        )}
      </div>
    </>
  );
}

export default PageDetail;
