import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GradientOrb from "../components/GradientOrb";
// import NoiseOverlay from "../components/NoiseOverlay";
import isMobile from "../utils/IsMobile";

gsap.registerPlugin(ScrollTrigger);

const ROLES = ["Web Development", "UI/UX Design", "Search Engine Optimization", "Full Stack Development","System Design"];

const Hero = () => {
  const sectionRef = useRef(null);
  const nameRef    = useRef(null);
  const lastRef    = useRef(null);
  const descRef    = useRef(null);
  const lineRef    = useRef(null);
  const scrollRef  = useRef(null);
  const gridRef    = useRef(null);
  const badgeRef   = useRef(null);
  const statusRef  = useRef(null);
  const cardRef    = useRef(null);
  const statsWrapRef = useRef(null);
  const statsRef     = useRef([]);
  const counterRefs  = useRef([]);

  const STATS = [
    { end: 98, suffix: "%", label: "Client Satisfaction Rate" },
    { end: 10, suffix: "+", label: "Projects Launched", highlight: true },
    { end: 5, suffix: "+", label: "Global Clients and Growing", avatars: true },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(gridRef.current.children,
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 1.6, stagger: 0.05, ease: "power3.inOut" }
    );
    tl.fromTo([statusRef.current, badgeRef.current],
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, "-=0.9"
    );
    tl.fromTo(nameRef.current,
      { y: "105%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.3, ease: "power4.out" }, "-=0.8"
    );
    tl.fromTo(lastRef.current,
      { y: "105%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 1.3, ease: "power4.out" }, "-=1.1"
    );
    tl.fromTo(lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 0.9, ease: "expo.out" }, "-=0.6"
    );
    tl.fromTo(scrollRef.current,
      { opacity: 0 }, { opacity: 1, duration: 0.6 }, "-=0.3"
    );

    if (!isMobile()) {
      gsap.to(nameRef.current, {
        yPercent: -30, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.2 },
      });
      gsap.to(lastRef.current, {
        yPercent: -20, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.8 },
      });
      gsap.to(gridRef.current, {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 2.2 },
      });
      gsap.to([statusRef.current, badgeRef.current], {
        yPercent: 28, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    }
    gsap.to(scrollRef.current, {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "25% top", scrub: true },
    });

    // Card + role list fade-up on scroll (mirrors Shan's data-aos="fade-up")
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 88%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(
        cardRef.current.querySelectorAll(".role-item"),
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", delay: 0.15,
          scrollTrigger: { trigger: cardRef.current, start: "top 88%", toggleActions: "play none none none" },
        }
      );
    }

    // Stats stack fade-up on scroll (mirrors Shan's data-aos="fade-up" + purecounter)
    statsRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: i * 0.12,
          scrollTrigger: { trigger: statsWrapRef.current, start: "top 88%", toggleActions: "play none none none" },
        }
      );

      const target = STATS[i].end;
      const obj = { val: 0 };
      gsap.fromTo(
        obj,
        { val: 0 },
        {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          delay: i * 0.12 + 0.1,
          scrollTrigger: { trigger: statsWrapRef.current, start: "top 88%", toggleActions: "play none none none" },
          onUpdate: () => {
            if (counterRefs.current[i]) {
              counterRefs.current[i].textContent = Math.round(obj.val) + STATS[i].suffix;
            }
          },
        }
      );
    });
  });

  useEffect(() => {
    if (isMobile()) return;
    const s = sectionRef.current;
    if (!s) return;
    const onMove = (e) => {
      const rx = ((e.clientY / window.innerHeight) - 0.5) * 5;
      const ry = ((e.clientX / window.innerWidth) - 0.5) * -5;
      gsap.to(s, { rotateX: rx, rotateY: ry, duration: 2, ease: "power2.out", transformPerspective: 1200, transformOrigin: "center center" });
    };
    const onLeave = () => gsap.to(s, { rotateX: 0, rotateY: 0, duration: 1.5, ease: "power3.out" });
    s.addEventListener("mousemove", onMove);
    s.addEventListener("mouseleave", onLeave);
    return () => { s.removeEventListener("mousemove", onMove); s.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-end pb-16 px-8 md:px-16 pt-32 overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      <GradientOrb x="15%" y="25%" size={700} color="#CAFF00" opacity={0.035} />
      <GradientOrb x="80%" y="70%" size={500} color="#CAFF00" opacity={0.025} />

      {/* <NoiseOverlay opacity={0.038} speed={2} zIndex={1} /> */}

      <div ref={gridRef} className="absolute inset-0 pointer-events-none flex">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px"
            style={{ left: `${(i + 1) * 10}%`, background: "var(--border-sm)" }} />
        ))}
      </div>

      <div ref={statusRef} className="absolute top-24 left-8 md:left-16 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: "#CAFF00", boxShadow: "0 0 8px #CAFF00", animation: "hpulse 2s infinite" }} />
        <span className="label text-muted">Available for work</span>
      </div>

      <div ref={badgeRef} className="absolute top-24 right-8 md:right-16 label text-muted">
        2026 — PRESENT
      </div>

      <div className="relative select-none mb-0" style={{ zIndex: 1 }}>
        <div style={{ overflow: "hidden" }} ref={nameRef}>
          <h1 className="display-xl text-offwhite leading-none" style={{ display: "block" }}>
            ADITYA
          </h1>
        </div>
        <div style={{ overflow: "hidden" }} ref={lastRef}>
          <h1
            className="display-xl leading-none"
            style={{ WebkitTextStroke: "1.5px var(--border)", color: "transparent" }}
          >
            SESWANI
          </h1>
        </div>
      </div>

      <div ref={lineRef} className="rule my-8" style={{ zIndex: 1 }} />

      <div ref={descRef} className="flex flex-col md:flex-row md:items-end justify-between gap-8" style={{ zIndex: 1 }}>
        <div
          ref={cardRef}
          className="rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border-xs)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
            padding: "clamp(24px,3vw,40px)",
            maxWidth: 460,
          }}
        >
          <h3
            className="text-offwhite"
            style={{ fontSize: "clamp(18px,2.1vw,24px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}
          >
            Hello! I'm Aditya —<br />a full-stack developer and problem solver.
          </h3>
          <p className="body-lg" style={{ color: "var(--text-dim)", lineHeight: 1.7, fontSize: 14, marginBottom: 22 }}>
            CS undergraduate building high-performance web apps,
            backend systems, and AI-powered tools that solve real problems.
          </p>

          <ul className="flex flex-col gap-1">
            {ROLES.map((role) => (
              <li
                key={role}
                className="role-item flex items-center gap-3"
                style={{
                  padding: "10px 4px",
                  borderBottom: "1px solid var(--border-xs)",
                  fontSize: "clamp(15px,1.5vw,18px)",
                  fontWeight: 500,
                  color: "var(--text-offwhite, #fff)",
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#CAFF00"; e.currentTarget.style.transform = "translateX(4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-offwhite, #fff)"; e.currentTarget.style.transform = "translateX(0)"; }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
                  <line x1="7" y1="1" x2="7" y2="13" stroke="#CAFF00" strokeWidth="1.5" />
                  <line x1="1" y1="7" x2="13" y2="7" stroke="#CAFF00" strokeWidth="1.5" />
                </svg>
                {role}
              </li>
            ))}
          </ul>
        </div>

        <div ref={statsWrapRef} className="flex flex-col gap-4 shrink-0 w-full md:w-[260px]">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              ref={el => (statsRef.current[i] = el)}
              className="rounded-2xl"
              style={
                stat.highlight
                  ? {
                      background: "#CAFF00",
                      padding: "20px 22px",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-xs)",
                      backdropFilter: "blur(8px)",
                      padding: "20px 22px",
                    }
              }
            >
              {stat.avatars && (
                <div className="flex items-center" style={{ marginBottom: 10 }}>
                  {[0, 1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: 30,
                        height: 30,
                        marginLeft: n === 0 ? 0 : -10,
                        border: "2px solid var(--bg, #0a0a0a)",
                        background: `linear-gradient(135deg, #CAFF00, #6b8f00)`,
                        color: "#0a0a0a",
                        fontSize: 11,
                        fontWeight: 700,
                        zIndex: 4 - n,
                      }}
                    >
                      {["A", "S", "R", "K"][n]}
                    </div>
                  ))}
                </div>
              )}

              <h4
                ref={el => (counterRefs.current[i] = el)}
                style={{
                  fontSize: "clamp(28px,3vw,34px)",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: 6,
                  color: stat.highlight ? "#0a0a0a" : "var(--text-offwhite, #fff)",
                }}
              >
                0{stat.suffix}
              </h4>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: stat.highlight ? "rgba(10,10,10,0.75)" : "var(--text-dim)",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
        style={{ transform: "translateX(-50%)", zIndex: 1 }}>
        <div className="w-px h-14 overflow-hidden" style={{ background: "var(--border-xs)" }}>
          <div className="w-full" style={{ height: "50%", background: "#CAFF00", animation: "scrollDrop 2s ease-in-out infinite" }} />
        </div>
        <span className="label text-muted" style={{ fontSize: 9, letterSpacing: "0.3em" }}>SCROLL</span>
      </div>

      <style>{`
        @keyframes hpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          30%  { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;