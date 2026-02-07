import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    useGetPagesQuery,
    useAddSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation,
    useAddTextBlockMutation,
    useUpdateBlockLayoutMutation,
} from "../services/api";
import GridLayout from "react-grid-layout";
import "../styles/PageDetail.css";

type PageDetailProps = {
    role: "user" | "admin";
};

function PageDetail({ role }: PageDetailProps) {
    const { pageId } = useParams<{ pageId: string }>();
    const { data: pages, isLoading, refetch } = useGetPagesQuery();

    const [addSection] = useAddSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
    const [deleteSection] = useDeleteSectionMutation();
    const [addTextBlock] = useAddTextBlockMutation();
    const [updateBlockLayout] = useUpdateBlockLayoutMutation();

    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [sectionTitle, setSectionTitle] = useState("");

    if (isLoading) {
        return <div>Loading page...</div>;
    }

    const page = pages?.find((p) => p.id === pageId) ?? pages?.[0];

if (!page) {
    return <div>No pages available</div>;
}


    return (
        <div>
        <h2>{page.title}</h2>

        {role === "admin" && (
            <button
            onClick={async () => {
                await addSection({
                pageId: page.id,
                title: "New section",
                });
                refetch();
            }}
            style={{ marginBottom: 16 }}
            >
            Add section
            </button>
        )}

        {page.sections.length === 0 && <p>No sections yet.</p>}

        {page.sections.map((section) => (
            <div key={section.id} className="card">
            {editingSectionId === section.id ? (
                <div>
                <input
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                />
                <button
                    onClick={() => {
                    updateSection({
                        pageId: page.id,
                        sectionId: section.id,
                        title: sectionTitle,
                    });
                    setEditingSectionId(null);
                    }}
                >
                    Save
                </button>
                </div>
            ) : (
                <div>
                <h3>{section.title}</h3>

                {role === "admin" && (
                    <button
                    onClick={() => {
                        addTextBlock({
                        pageId: page.id,
                        sectionId: section.id,
                        content: "<p>Edit this text</p>",
                        });
                    }}
                    style={{ marginBottom: 12 }}
                    >
                    Add text block
                    </button>
                )}

                <GridLayout
                    key={role}
                    cols={12}
                    rowHeight={40}
                    width={800}
                    isDraggable={role === "admin"}
                    isResizable={role === "admin"}
                    isDroppable={false}
                    preventCollision={true}
                    compactType={null}
                    margin={[8, 8]}
                    onLayoutChange={(layout) => {
                    if (role !== "admin") return;

                    layout.forEach((item) => {
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
                    }}
                >
                    {section.blocks.map((block) => {
                    if (block.type === "text") {
                        return (
                        <div
                            key={block.id}
                            data-grid={{
                            x: block.layout.x,
                            y: block.layout.y,
                            w: block.layout.w,
                            h: block.layout.h,
                            static: role !== "admin",
                            }}
                            className="text-block-wrapper"
                        >
                            {role === "admin" && (
                            <div className="text-editor-toolbar">
                                <button onClick={() => document.execCommand("bold")}>
                                B
                                </button>
                                <button onClick={() => document.execCommand("italic")}>
                                I
                                </button>
                                <button
                                onClick={() =>
                                    document.execCommand("underline")
                                }
                                >
                                U
                                </button>
                            </div>
                            )}

                            {role === "admin" ? (
                            <div
                                className="text-editor"
                                contentEditable
                                suppressContentEditableWarning
                                dangerouslySetInnerHTML={{
                                __html: block.content,
                                }}
                            />
                            ) : (
                            <div
                                className="text-block"
                                dangerouslySetInnerHTML={{
                                __html: block.content,
                                }}
                            />
                            )}
                        </div>
                        );
                    }

                    if (block.type === "image") {
                        return (
                        <div key={block.id} data-grid={block.layout}>
                            <img
                            src={block.url}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            />
                        </div>
                        );
                    }

                    return null;
                    })}
                </GridLayout>

                {role === "admin" && (
                    <div style={{ marginTop: 12 }}>
                    <button
                        onClick={() => {
                        setEditingSectionId(section.id);
                        setSectionTitle(section.title);
                        }}
                    >
                        Edit section
                    </button>

                    <button
                        onClick={() => {
                        const confirmed = window.confirm(
                            "Are you sure you want to delete this section?"
                        );
                        if (!confirmed) return;

                        deleteSection({
                            pageId: page.id,
                            sectionId: section.id,
                        });
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        Delete section
                    </button>
                    </div>
                )}
                </div>
            )}
            </div>
        ))}
        </div>
    );
}

export default PageDetail;
