import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import isMobile from "./utils/isMobile";

import Preloader      from "./components/Preloader";
import RibbonCursor   from "./components/RibbonCursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar         from "./sections/Navbar";
import Hero           from "./sections/Hero";
import About          from "./sections/About";
import Projects       from "./sections/Projects";
import Experience     from "./sections/Experience";
import Contact        from "./sections/Contact";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const App = () => {
  const orbRef      = useRef(null);
  const smootherRef = useRef(null);
  const [preloadDone, setPreloadDone] = useState(false);

  useGSAP(() => {
    if (!preloadDone) return;

    // GSAP ScrollSmoother — tuned down from the shan-portfolio reference.
    // smooth:4 meant the page took ~4s to "catch up" to the mouse wheel,
    // which reads as laggy rather than buttery. 1.1–1.3 is the sweet spot
    // most sites use — still smooth, but tracks the input closely.
    // effects:true was also on with zero data-speed/data-lag elements in
    // the DOM, so it was scanning the whole page every refresh for nothing.
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2.5,
      smoothTouch: 0.1,
      effects: false,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // Global orb travels right → left as user scrolls
    if (!isMobile()) {
      gsap.to(orbRef.current, {
        left: "-10%",
        top: "70%",
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });
    }

    return () => {
      smootherRef.current?.kill();
    };
  }, { dependencies: [preloadDone] });

  return (
    <>
      {/* Preloader — unmounts itself via opacity but stays in DOM briefly */}
      {!preloadDone && (
        <Preloader onComplete={() => setPreloadDone(true)} />
      )}

      {/* Fixed-position UI lives OUTSIDE the smooth-content wrapper.
          ScrollSmoother animates #smooth-content with a transform, and any
          position:fixed descendant of a transformed element gets dragged
          along with it — so these stay siblings instead. */}
      <ScrollProgress />

      <div
        ref={orbRef}
        style={{
          position: "fixed",
          left: "85%",
          top: "20%",
          transform: "translate(-50%, -50%)",
          width: 800, height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(202,255,0,0.12) 0%, rgba(202,255,0,0.04) 40%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          willChange: "left, top",
        }}
      />

      <RibbonCursor />
      <Navbar />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main style={{ position: "relative", zIndex: 1 }}>
            <Hero />
            <About />
            <Projects />
            <Experience />
            <Contact />
          </main>
        </div>
      </div>
    </>
  );
};

export default App;