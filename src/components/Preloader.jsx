import { useEffect, useRef } from "react";
import gsap from "gsap";

// Same three path states as the shan-portfolio preloader:
// a jagged double-hump curtain edge -> a big curve -> a flat line.
const JAGGED = "M0,1005S175,995,500,995s500,5,500,5V0H0Z";
const CURVE  = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
const FLAT   = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

const LOADING_LETTERS = "ADITYA".split("");

const Preloader = ({ onComplete }) => {
  const overlayRef  = useRef(null);
  const svgRef      = useRef(null);
  const headingRef  = useRef(null);
  const lettersRef  = useRef([]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const svg     = svgRef.current;
    if (!overlay || !svg) return;

    gsap.set(svg, { attr: { d: JAGGED } });

    // Letter-by-letter blink, same 1s infinite-alternate / 0.1s stagger
    // as the original CSS keyframes.
    const blinkTl = gsap.to(lettersRef.current, {
      opacity: 0,
      duration: 1,
      ease: "none",
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        blinkTl.kill();
        onComplete();
      },
    });

    tl.to(headingRef.current, {
      delay: 2.4,
      y: -80,
      opacity: 0,
      duration: 0.6,
    })
      // SVG curve animation
      .to(svg, {
        duration: 0.6,
        attr: { d: CURVE },
        ease: "power2.inOut",
      })
      // Flatten SVG
      .to(svg, {
        duration: 0.6,
        attr: { d: FLAT },
        ease: "power2.inOut",
      })
      // Slide preloader up
      .to(overlay, {
        yPercent: -130,
        duration: 0.8,
        ease: "power4.inOut",
      });

    return () => {
      tl.kill();
      blinkTl.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        height: "100vh",
        width: "100%",
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        zIndex: 9999999,
      }}
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 0,
          width: "100vw",
          height: "110vh",
          fill: "#0D0D0D",
          filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
        }}
      >
        <path ref={svgRef} />
      </svg>

      <div
        ref={headingRef}
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
        }}
      >
        {LOADING_LETTERS.map((letter, i) => (
          <span
            key={i}
            ref={(el) => (lettersRef.current[i] = el)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 30,
              fontWeight: 600,
              color: "#F0EDE6",
              letterSpacing: 15,
              textTransform: "uppercase",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;