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
    const play = () => {
        if (!audioRef.current) return;
        audioRef.current.play();
        setIsPlaying(true);
    };
    const pause = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    };
    return (
        <div
        style={{
            position: "relative",
            margin: "16px",
            borderRadius: 12,
            overflow: "hidden",
            backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        {/* ADMIN DELETE */}
        {canDelete && (
            <button
            onClick={onDelete}
            style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
                background: "rgba(0,0,0,0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 24,
                height: 24,
                cursor: "pointer",
            }}
            >
            ✕
            </button>
        )}
        {/* OVERLAY */}
        <div
            style={{
                backdropFilter: "blur(4px)",
                background: "rgba(0,0,0,0.45)",
                padding: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 24,
                color: "white",
            }}
            >
            <audio ref={audioRef} src={audioUrl} loop />
            {/* CONTROLS */}
            <div
            style={{
                display: "flex",
                gap: 24,
                alignItems: "center",
                fontSize: 26,
            }}
            >
            <button onClick={play} disabled={isPlaying} style={controlStyle}>
            ▶
            </button>
            <button onClick={pause} disabled={!isPlaying} style={controlStyle}>
            ⏸
            </button>
            </div>
            {/* LABEL */}
            <div style={{ fontSize: 13, opacity: 0.9 }}>
            🌿 
            </div>
        </div>
        </div>
    );
}

const controlStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
};
