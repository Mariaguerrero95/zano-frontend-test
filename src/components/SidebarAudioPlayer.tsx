import { useRef, useState } from "react";

type Props = {
    audioUrl: string;
    canDelete?: boolean;
    onDelete?: () => void;
};

export default function SidebarAudioPlayer({
    audioUrl,
    canDelete = false,
    onDelete,
    }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
        audioRef.current.pause();
        } else {
        audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };
    const stopAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    };

    return (
        <div
        style={{
            position: "relative",
            padding: 16,
            borderTop: "1px solid #e5e7eb",
            background: "#ffffff",
        }}
        >
        {/* DELETE BUTTON (ADMIN ONLY) */}
        {canDelete && (
            <button
            onClick={onDelete}
            style={{
                position: "absolute",
                top: 8,
                right: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 14,
                color: "#6b7280",
            }}
            aria-label="Remove audio player"
            >
            ✕
            </button>
        )}

        <div style={{ fontSize: 14, marginBottom: 8 }}>
            🌿 Ambient sound
        </div>
            <audio ref={audioRef} src={audioUrl} />
        <div style={{ display: "flex", gap: 8 }}>
            <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={stopAudio}>Stop</button>
        </div>
        </div>
    );
}
