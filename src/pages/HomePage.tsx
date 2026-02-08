import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "../styles/HomePage.css";
import clickSound from "../assets/click.wav";

function HomePage() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleNavigate = (path: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    //to hear the click
    setTimeout(() => {
      navigate(path);
    }, 120);
  };

  return (
    <div className="home-hero">
      <h1>Asana Atlas</h1>
      <p className="home-subtitle">
        Everything you need to start, practice and deepen your yoga journey.”
      </p>
      {/* Audio invisible */}
      <audio ref={audioRef} src={clickSound} preload="auto" />
      <div className="home-cards">
        <div
          className="home-card"
          onClick={() => handleNavigate("/pages/getting-started")}
        >
          <h3>Getting Started</h3>
          <p>Your first steps into yoga practice.</p>
        </div>
        <div
          className="home-card"
          onClick={() => handleNavigate("/pages/product-guides")}
        >
          <h3>Practice Guides</h3>
          <p>Flows, postures and mindful routines.</p>
        </div>
        <div
          className="home-card"
          onClick={() => handleNavigate("/pages/faq")}
        >
          <h3>FAQ</h3>
          <p>Answers to common yoga questions.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

