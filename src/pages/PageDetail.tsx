import { useParams } from "react-router-dom";
import { useState } from "react";
import {
    useGetPagesQuery,
    useAddSectionMutation,
    useUpdateSectionMutation,
} from "../services/api";

type PageDetailProps = {
    role: "user" | "admin";
};

function PageDetail({ role }: PageDetailProps) {
    const { pageId } = useParams<{ pageId: string }>();
    const {data: pages,isLoading,refetch } = useGetPagesQuery();
    const [addSection] = useAddSectionMutation();
    const [updateSection] = useUpdateSectionMutation();
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
                        setEditingSectionId(section.id);
                        setSectionTitle(section.title);
                    }}
                    >
                    Edit
                    </button>
                )}
                </>
            )}
            </div>
        ))}
        </div>
    );
}

export default PageDetail;
