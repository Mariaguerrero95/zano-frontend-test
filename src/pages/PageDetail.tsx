import { useParams } from "react-router-dom";
import {
    useGetPagesQuery,
    useAddSectionMutation,
    useDeleteSectionMutation,
    useAddTextBlockMutation,
    useUpdateTextBlockMutation,
} from "../services/api";
import RichTextEditor from "../components/RichTextEditor";
import "../styles/PageDetail.css";

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

    if (isLoading || !pages || pages.length === 0) {
        return <div>Loading…</div>;
    }
    const page = pages.find((p) => p.id === pageId) ?? pages[0];
    if (!page) return <div>Page not found</div>;
    return (
        <div className="page-detail">
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
        {page.sections.length === 0 && <p>No sections yet.</p>}
        {page.sections.map((section) => (
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
                Add text block
                </button>
            )}
            {section.blocks.map((block) => {
                if (block.type !== "text") return null;
                return (
                <div key={block.id} className="text-block">
                    <RichTextEditor
                    value={block.content}
                    editable={role === "admin"}
                    onChange={(html) => {
                        updateTextBlock({
                        pageId: page.id,
                        sectionId: section.id,
                        blockId: block.id,
                        content: html,
                        });
                    }}
                    />
                </div>
                );
            })}
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
        ))}
        </div>
    );
}

export default PageDetail;
