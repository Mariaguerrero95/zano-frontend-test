import "../styles/MoodFeedbackModal.css";
import { useState } from "react";
import {
    useSetPageMoodMutation,
    useGetPageMoodQuery,
} from "../services/api";
import type { MoodLevel } from "../types/guide";

const MOODS: { value: MoodLevel; emoji: string; label: string }[] = [
    { value: "very_bad", emoji: "😡", label: "Very bad" },
    { value: "bad", emoji: "😕", label: "Bad" },
    { value: "neutral", emoji: "😐", label: "Okay" },
    { value: "good", emoji: "🙂", label: "Good" },
    { value: "very_good", emoji: "😄", label: "Very good" },
];

type Props = {
    pageId: string;
    onSelect?: (mood: MoodLevel) => void;
};

export default function MoodFeedback({ pageId, onSelect  }: Props) {
    const [setPageMood] = useSetPageMoodMutation();
    const { data: savedMood } = useGetPageMoodQuery({ pageId });
    const [selected, setSelected] = useState<MoodLevel | null>(null);

    const handleSelect = async (mood: MoodLevel) => {
        setSelected(mood);
        await setPageMood({ pageId, mood });
        onSelect?.(mood);
    };

    const finalMood = savedMood?.mood ?? selected;

    if (finalMood) {
        const mood = MOODS.find((m) => m.value === finalMood);
        return (
        <div className="mood-container mood-thanks">
            <div className="mood-emoji">{mood?.emoji}</div>
            <h3>Thanks for your feedback 🌿</h3>
            <p>We use this to improve our guides.</p>
        </div>
    );
    }

    return (
        <div className="mood-container">
        <h3 className="mood-title">How did this guide make you feel?</h3>
        <div className="mood-options">
            {MOODS.map((m) => (
            <button
            key={m.value}
            className="mood-button"
            onClick={() => {
                handleSelect(m.value);
                onSelect?.(m.value);
            }}
            >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
            </button>
            ))}
        </div>
        </div>
    );
}
