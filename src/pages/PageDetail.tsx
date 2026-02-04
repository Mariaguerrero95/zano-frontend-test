import { useParams } from "react-router-dom";

function PageDetail() {
    const { pageId } = useParams();

    return (
    <div>
        <h2>Page detail</h2>
        <p>Page ID: {pageId}</p>
    </div>
    );
}

export default PageDetail;
