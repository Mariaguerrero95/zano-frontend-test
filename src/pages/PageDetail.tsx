import { useParams } from "react-router-dom";
import { useState } from "react";
import {useGetPagesQuery,useAddSectionMutation,useUpdateSectionMutation,useDeleteSectionMutation,useAddTextBlockMutation} from "../services/api";

type PageDetailProps = {
    role: "user" | "admin";
};

function PageDetail({ role }: PageDetailProps) {
    const { pageId } = useParams<{ pageId: string }>();
    const {data: pages,isLoading,refetch } = useGetPagesQuery();
    const [addSection] = useAddSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
    const [deleteSection] = useDeleteSectionMutation();
    const [addTextBlock] = useAddTextBlockMutation();
    const [editingSectionId, setEditingSectionId] =
    useState<string | null>(null);
    const [sectionTitle, setSectionTitle] = useState("");

    if (isLoading) {
    return <div>Loading page...</div>;
    }
    const page = pages?.find((p) => p.id === pageId);
    if (!page) {
        return <div>Page not found</div>;
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
            <div
            key={section.id}
            style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
            }}
            >
            {editingSectionId === section.id ? (
                <>
                <input
                    value={sectionTitle}
                    onChange={(e) =>
                    setSectionTitle(e.target.value)
                    }
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
                </>
            ) : (
                <>
                    <h3>{section.title}</h3>
                    {role === "admin" && (
                    <button
                        onClick={() => {
                        addTextBlock({
                            pageId: page.id,
                            sectionId: section.id,
                            content: "This is a text block",
                        });
                        }}
                        style={{ marginBottom: 8 }}
                    >
                        Add text block
                    </button>
                    )}

                    {section.blocks.length === 0 ? (
                    <p style={{ fontStyle: "italic", color: "#666" }}>
                        No blocks yet
                    </p>
                    ) : (
                    section.blocks.map((block) => {
                        if (block.type === "text") {
                        return (
                            <div
                            key={block.id}
                            style={{
                                padding: 8,
                                border: "1px dashed #ccc",
                                marginBottom: 8,
                            }}
                            >
                            {block.content}
                            </div>
                        );
                        }

                        if (block.type === "image") {
                        return (
                            <img
                            key={block.id}
                            src={block.url}
                            alt=""
                            style={{
                                maxWidth: "100%",
                                marginBottom: 8,
                            }}
                            />
                        );
                        }

                        return null;
                    })
)}

                    {role === "admin" && (
                        <>
                        <button
                            onClick={() => {
                            setEditingSectionId(section.id);
                            setSectionTitle(section.title);
                            }}
                        >
                            Edit
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
                            Delete
                        </button>
                        </>
                    )}
                    </>
                )
                
                }
            </div>
        ))}
        </div>
    );
}

export default PageDetail;
