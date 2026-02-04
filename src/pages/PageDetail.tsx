import { useParams } from "react-router-dom";
import { useGetPagesQuery, useAddSectionMutation } from "../services/api";

type PageDetailProps = {
    role: "user" | "admin";
};

function PageDetail({ role }: PageDetailProps) {
    const { pageId } = useParams<{ pageId: string }>();
    const { data: pages, isLoading } = useGetPagesQuery();
    const [addSection, { isLoading: isAdding }] =
    useAddSectionMutation();

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
            onClick={() =>
            addSection({
                pageId: page.id,
                title: "New section",
            })
            }
            disabled={isAdding}
            style={{ marginBottom: 16 }}
        >
            Add section
        </button>
        )}
        {page.sections.length === 0 ? (
        <p>No sections yet.</p>
        ) : (
        page.sections.map((section) => (
            <div
            key={section.id}
            style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
            }}
            >
            <h3>{section.title}</h3>
            </div>
        ))
    )}
    </div>
    );
}

export default PageDetail;

