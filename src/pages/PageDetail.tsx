import { useParams } from "react-router-dom";
import {
  useGetPagesQuery,
  useAddSectionMutation,
  useDeleteSectionMutation,
  useAddTextBlockMutation,
  useUpdateTextBlockMutation,
  useUpdateBlockLayoutMutation,
} from "../services/api";
import RichTextEditor from "../components/RichTextEditor";
import "../styles/PageDetail.css";
import GridLayout, { type Layout } from "react-grid-layout";

type PageDetailProps = {
  role: "user" | "admin";
};

function PageDetail({ role }: PageDetailProps) {
  const { pageId } = useParams<{ pageId: string }>();
  const { data: pages, isLoading, refetch } = useGetPagesQuery();

  const [addSection] = useAddSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [addTextBlock] = useAddTextBlockMutation();
  const [updateTextBlock] = useUpdateTextBlockMutation();
  const [updateBlockLayout] = useUpdateBlockLayoutMutation();

  if (isLoading || !pages) return <div>Loading…</div>;

  const page = pages.find((p) => p.id === pageId) ?? pages[0];
  if (!page) return <div>Page not found</div>;
  return (
    <div className={`page-detail ${role}`}>
      <h2>{page.title}</h2>

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
        const blocks = section.blocks.filter((b) => b.type === "text");
        const layout: Layout[] = blocks.map((block) => ({
          i: block.id,
          x: block.layout.x,
          y: block.layout.y,
          w: block.layout.w,
          h: block.layout.h,
        }));
        return (
          <div key={section.id} className="card">
            <h3>{section.title}</h3>
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
              draggableCancel=".editor-content, .rich-editor, img, input, textarea, button"
              margin={[12, 12]}
              onLayoutChange={role === "admin" ? (currentLayout) => {
                currentLayout.forEach((item) => {
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
                  });
                });
              } : undefined}
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
                      onChange={(html) => {
                        if (role !== "admin") return;
                        updateTextBlock({
                          pageId: page.id,
                          sectionId: section.id,
                          blockId: block.id,
                          content: html,
                          imageUrl: block.imageUrl,
                        });
                      }}
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
                            reader.onload = () => {
                              updateTextBlock({
                                pageId: page.id,
                                sectionId: section.id,
                                blockId: block.id,
                                content: block.content,
                                imageUrl: reader.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById(`upload-${block.id}`)
                              ?.click()
                          }
                        >
                          {block.imageUrl ? "Replace image" : "Upload image"}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </GridLayout>
            )}
            {role === "admin" && (
              <button
                onClick={() => {
                  if (!window.confirm("Delete section?")) return;
                  deleteSection({
                    pageId: page.id,
                    sectionId: section.id,
                  });
                }}
              >
                Delete section
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PageDetail;
