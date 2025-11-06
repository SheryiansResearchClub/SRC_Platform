import React, { useEffect } from "react"; 
import "./Home.css";

import Loader from "./components/Loader";
import ApplicationForm from "./components/ApplicationForm";
import ThreeScene from "./three/ThreeScene";
import Nav from "./components/Nav";
import HeroSection from "./components/HeroSection";
import Moto from "./components/Moto";
import Manifesto from "./components/Manifesto";
import Carousel from "./components/Carousel";
import Cards from "./components/Cards";
import Timelaps from "./components/Timelaps";
import Mentors from "./components/Mentors";
import OpenRoles from "./components/OpenRoles";
import Footer from "./components/Footer";
import VideoPlayer from "./components/VideoPlayer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import startHome from "./homeInit";

const Home = () => {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    // Start the homepage animation/init logic (assets, three scene, GSAP wiring)
    // This is the port of the original SRCclub-site main.js adapted for React.
    startHome();
  }, []);

  const startRef = React.useRef(null);
  const targetRef = React.useRef(null);

  return (
    <div className="home-root">
      <ThreeScene>
        {/* HeroSection FIRST so .small and .big elements exist in DOM */}
        <main className="">
          <Nav />
          <ApplicationForm />
          <VideoPlayer />

          <HeroSection startRef={startRef} targetRef={targetRef} />
          <Moto />
          <Manifesto />
          <Carousel />
          <Cards />
          <Timelaps />
          <Mentors />
          <OpenRoles />
          <Footer />
        </main>

        {/* Loader component AFTER HeroSection so it can find elements */}
        <Loader startRef={startRef} targetRef={targetRef} />
        <div id="canvas-container" />
        {/* Global scroll progress bar (mirrors static site's behavior) */}
        <div className="scrollProgress">
          <div className="bar" />
        </div>

        {/* Mouse follower custom cursor */}
        <div className="mouseFollower playReel mini">
          <div className="play-circle">Click to Play</div>
          <svg
            className="play"
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="none"
            viewBox="0 0 36 36"
          >
            <path
              fill="currentColor"
              d="M7 7.29c0-1.5 1.59-2.466 2.92-1.776l20.656 10.71c1.439.747 1.439 2.805 0 3.552L9.92 30.486C8.589 31.176 7 30.21 7 28.71V7.29Z"
            ></path>
          </svg>
          <div className="open">Click</div>
        </div>

        {/* Music controls */}
        <div className="music">
          <img
            className="sound vinyl"
            data-mouse-extra-mini
            src="/images/icons/vinyl.svg"
            alt=""
          />
          <img className="ring sound" src="/images/icons/sound.gif" alt="" />
        </div>

        {/* Music entry options */}
        <div className="music-options">
          <div className="options">
            <div className="with option">Enter with music</div>
            <div className="without option">Enter without music</div>
          </div>
        </div>

        {/* Background image */}
        <div className="background">
          <img src="/images/bg.webp" alt="" />
        </div>
        <div className="dot" />
      </ThreeScene>
    </div>
  );
};

export default Home;
