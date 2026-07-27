import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Themetoggle = () => {
  const [isDark, setIsDark] = useState(true);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const sunRef   = useRef(null);
  const moonRef  = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.setAttribute("data-theme", "light");
      gsap.set(thumbRef.current, { x: 20 });
      gsap.set(sunRef.current,   { opacity: 1, scale: 1 });
      gsap.set(moonRef.current,  { opacity: 0, scale: 0.5 });
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);

    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");

    // Thumb slide
    gsap.to(thumbRef.current, {
      x: next ? 0 : 20,
      duration: 0.35,
      ease: "power3.inOut",
    });

    // Track color
    gsap.to(trackRef.current, {
      backgroundColor: next ? "#1A1A1A" : "#E8E5DC",
      duration: 0.35,
    });

    // Icon swap
    gsap.to(next ? sunRef.current : moonRef.current, {
      opacity: 0, scale: 0.5, duration: 0.2, ease: "power2.in",
    });
    gsap.to(next ? moonRef.current : sunRef.current, {
      opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.7)", delay: 0.1,
    });
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center shrink-0"
      style={{
        width: 48,
        height: 28,
        borderRadius: 999,
        padding: 4,
        border: "1px solid rgba(240,237,230,0.12)",
        background: isDark ? "#1A1A1A" : "#E8E5DC",
        cursor: "none",
        outline: "none",
        transition: "border-color 0.3s",
      }}
      data-cursor
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(202,255,0,0.45)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(240,237,230,0.12)";
      }}
      ref={trackRef}
    >
      {/* Thumb */}
      <span
        ref={thumbRef}
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 20,
          height: 20,
          left: 4,
          background: "#CAFF00",
          boxShadow: "0 0 8px rgba(202,255,0,0.5)",
          willChange: "transform",
        }}
      >
        {/* Moon icon */}
        <svg
          ref={moonRef}
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          style={{ position: "absolute", opacity: 1 }}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="#0D0D0D"
          />
        </svg>
        {/* Sun icon */}
        <svg
          ref={sunRef}
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          style={{ position: "absolute", opacity: 0, scale: 0.5 }}
        >
          <circle cx="12" cy="12" r="5" fill="#0D0D0D" />
          <line x1="12" y1="1" x2="12" y2="3" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="21" x2="12" y2="23" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="1" y1="12" x2="3" y2="12" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="21" y1="12" x2="23" y2="12" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
    </button>
  );
};

export default Themetoggle;