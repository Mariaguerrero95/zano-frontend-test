import "../styles/MoodFeedbackModal.css";
import { useState } from "react";
import { useSetPageMoodMutation } from "../services/api";
import type { MoodLevel } from "../types/guide";

const MOODS: { value: MoodLevel; emoji: string; label: string }[] = [
    { value: "very_bad", emoji: "😡", label: "Very bad" },
    { value: "bad", emoji: "😕", label: "Bad" },
    { value: "neutral", emoji: "😐", label: "Okay" },
    { value: "good", emoji: "🙂", label: "Good" },
    { value: "very_good", emoji: "😄", label: "Very good" },
];

type MoodFeedbackProps = {
    pageId: string;
};

export default function MoodFeedbackModal({ pageId }: MoodFeedbackProps) {
    const [setPageMood] = useSetPageMoodMutation();
    const [selected, setSelected] = useState<MoodLevel | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const handleSelect = async (mood: MoodLevel) => {
    setSelected(mood);
    await setPageMood({ pageId, mood });
    setTimeout(() => {
        setSubmitted(true);
    }, 900);
};

return (
    <div className="mood-container">
        {!submitted ? (
        <>
            <h3 className="mood-title">How did this guide make you feel?</h3>
            <div className="mood-options">
            {MOODS.map((m) => (
                <button
                    key={m.value}
                    className={`mood-button ${
                        selected === m.value ? "active" : ""
                    }`}
                    disabled={!!selected && selected !== m.value}
                    onClick={() => handleSelect(m.value)}
                >
                    <span className="mood-emoji">{m.emoji}</span>
                    <span className="mood-label">{m.label}</span>
                </button>
            ))}
            </div>
        </>
        ) : (
        <div className="mood-thanks">
            <h3>Thanks for your feedback 🌿</h3>
            <p>Your response helps us improve this guide.</p>
        </div>
        )}
    </div>
    );
}
