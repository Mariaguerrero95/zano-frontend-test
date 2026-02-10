import { useNavigate, useOutletContext } from "react-router-dom";
import { useRef, useState } from "react";
import "../styles/HomePage.css";
import clickSound from "../assets/click.wav";
import {
  useGetPagesQuery,
  useUpdatePageMutation,
} from "../services/api";

type CardSubtitleMap = Record<string, string>;

function HomePage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { role } = useOutletContext<{ role: "user" | "admin"; }>();
  const { data: pages } = useGetPagesQuery();
  const [updatePage] = useUpdatePageMutation();
  const [subtitles, setSubtitles] = useState<CardSubtitleMap>({});
  const handleNavigate = (path: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setTimeout(() => {
      navigate(path);
    }, 120);
  };

  return (
    <div className="home-hero">
      <h1>Asana Atlas</h1>
      <p className="home-subtitle">
        Everything you need to start, practice and deepen your yoga journey.
      </p>
      <audio ref={audioRef} src={clickSound} preload="auto" />
      <div className="home-cards">
        {pages?.map((page) => (
            <div
            key={page.id}
            className="home-card"
            onClick={(e) => {
              const tag = (e.target as HTMLElement).tagName;
              if (tag === "INPUT" || tag === "TEXTAREA") return;
              handleNavigate(`/pages/${page.id}`);
            }}
          >
            {/* title */}
            {role === "admin" ? (
              <input
                value={page.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  updatePage({
                    pageId: page.id,
                    title: e.target.value,
                  })
                }
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  border: "none",
                  background: "transparent",
                  width: "100%",
                }}
              />
            ) : (
              <h3>{page.title}</h3>
            )}
            {/* subtitle */}
            {role === "admin" ? (
              <textarea
                value={
                  subtitles[page.id] ??
                  "Start exploring this guide"
                }
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  setSubtitles((prev) => ({
                    ...prev,
                    [page.id]: e.target.value,
                  }))
                }
                style={{
                  border: "none",
                  background: "transparent",
                  resize: "none",
                  width: "100%",
                  fontSize: 14,
                  color: "#6b7280",
                }}
              />
            ) : (
              <p>
                {subtitles[page.id] ??
                  "Start exploring this guide"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
