import { useNavigate } from "react-router-dom";
import "../styles/PracticePath.css";

function PracticePath() {
    const navigate = useNavigate();

    return (
        <div className="practice-path">
        <div
            className="practice-card"
            onClick={() =>
            navigate(
                "/pages/getting-started?section=postures"
            )
            }
        >
            <h3>Learn basic postures</h3>
            <p>
            Understand alignment and safety in the main yoga poses.
            </p>
        </div>
        <div
            className="practice-card"
            onClick={() =>
            navigate(
                "/pages/getting-started?section=breathing"
            )
            }
        >
            <h3>Breathing & awareness</h3>
            <p>
            Connect breath and movement to calm the mind.
            </p>
        </div>
        <div
            className="practice-card"
            onClick={() =>
            navigate(
                "/pages/getting-started?section=daily-practice"
            )
            }
        >
            <h3>Build a daily practice</h3>
            <p>
            Create a sustainable yoga routine that fits your life.
            </p>
        </div>
        </div>
    );
}

export default PracticePath;

