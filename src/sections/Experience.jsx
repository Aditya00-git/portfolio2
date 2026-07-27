import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience as _experience, achievements, certifications } from "../constants";
import GradientOrb from "../components/GradientOrb";
import Marquee from "../components/Marquee";

gsap.registerPlugin(ScrollTrigger);

// ─── Inject the new EduLinkUp internship entry ───────────────────────────────
const edulinkup = {
  id: "05",
  role: "Frontend Web Dev Intern",
  company: "EduLinkUp",
  status: "CURRENT",
  period: "2026",
  desc: "Building responsive UI components and crafting interactive interfaces with Tailwind CSS. Focused on explanation-driven learning tasks, UI/UX polish, and frontend delivery as part of the internship learning path.",
};

const experience = [..._experience, edulinkup];
// ─────────────────────────────────────────────────────────────────────────────

// ─── Gradient palette for the oval cert badges (cycled by index) ────────────
const certGradients = [
  "linear-gradient(135deg, var(--lime) 0%, #5C7A00 100%)",
  "linear-gradient(135deg, #FF7A45 0%, #FFC299 100%)",
  "linear-gradient(135deg, #4B7BEC 0%, #A6C8FF 100%)",
  "linear-gradient(135deg, #F0EDE6 0%, #B8B4AA 100%)",
  "linear-gradient(135deg, #FFD23D 0%, #FF9F1C 100%)",
  "linear-gradient(135deg, #B084F0 0%, #E6CCFF 100%)",
];

const CertSeal = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.85 }}>
    <path
      d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.27l-4.78 2.43.91-5.32-3.86-3.76 5.34-.78L12 2z"
      fill="rgba(0,0,0,0.55)"
    />
    <circle cx="12" cy="10.5" r="9" stroke="rgba(0,0,0,0.55)" strokeWidth="1.2" fill="none" />
  </svg>
);

// ─── "Certifications –" ticker items — alternating solid / stroke-outline,
//     same layout Shan uses right before his Services section ─────────────
const certMarqueeItems = Array.from({ length: 6 }).map((_, i) => (
  <span
    key={i}
    className={`marquee-big-title ${i % 2 === 1 ? "text-stroke" : ""}`}
  >
    Certifications <span className="marquee-dash">–</span>
  </span>
));

const CardContent = ({ exp }) => (
  <>
    <div className="flex items-start justify-between gap-2 mb-3">
      <div>
        <span className="index-num block mb-2">{exp.id}</span>
        <h3
          className="text-offwhite uppercase"
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(18px,1.9vw,30px)",
            lineHeight: 1,
          }}
        >
          {exp.role}
        </h3>
        <p className="label mt-1" style={{ color: "var(--lime)", letterSpacing: "0.14em" }}>
          {exp.company}
        </p>
      </div>
      <span
        className="label px-2 py-1 rounded-full shrink-0 text-xs"
        style={{
          background:
            exp.status === "CURRENT"
              ? "rgba(var(--lime-rgb), 0.1)"
              : exp.status === "UPCOMING"
              ? "rgba(99,179,237,0.10)"
              : "var(--border-sm)",
          color:
            exp.status === "CURRENT"
              ? "var(--lime)"
              : exp.status === "UPCOMING"
              ? "#63B3ED"
              : "var(--muted)",
          border: `1px solid ${
            exp.status === "CURRENT"
              ? "rgba(var(--lime-rgb), 0.3)"
              : exp.status === "UPCOMING"
              ? "rgba(99,179,237,0.3)"
              : "var(--border-xs)"
          }`,
          whiteSpace: "nowrap",
        }}
      >
        {exp.status}
      </span>
    </div>
    <div className="rule mb-3" />
    <p
      style={{
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "clamp(11px,1.1vw,13px)",
        color: "var(--text-dim)",
        lineHeight: 1.7,
      }}
    >
      {exp.desc}
    </p>
    <p className="label mt-4" style={{ color: "var(--text-dim)", fontSize: 10 }}>
      {exp.period}
    </p>
  </>
);

export default function Experience() {
  const sectionRef  = useRef(null);
  const wrapRef     = useRef(null);
  const lineRef     = useRef(null);
  const dotRefs     = useRef([]);
  const cardRefs    = useRef([]);
  const connRefs    = useRef([]);
  const achRefs     = useRef([]);
  const certRefs    = useRef([]);
  const achHeadRef  = useRef(null);
  const certHeadRef = useRef(null);

  useLayoutEffect(() => {
    const n          = experience.length;
    const PIN_SCROLL = 150 + n * 500;

    const ctx = gsap.context(() => {
      gsap.set(lineRef.current,  { scaleX: 0 });
      gsap.set(dotRefs.current,  { scale: 0, autoAlpha: 0 });
      gsap.set(cardRefs.current, { autoAlpha: 0, y: 30 });
      gsap.set(connRefs.current, { scaleY: 0 });

      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top top",
        end: `+=${PIN_SCROLL}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: `+=${PIN_SCROLL}`,
          scrub: 1.2,
        },
      });

      tl.to(lineRef.current, { scaleX: 1, ease: "none", duration: n });

      experience.forEach((_, i) => {
        const insertTime = ((i + 0.55) / n) * n;

        tl.to(
          dotRefs.current[i],
          { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)" },
          insertTime
        );
        tl.to(
          connRefs.current[i],
          { scaleY: 1, duration: 0.2, ease: "power2.out" },
          insertTime + 0.1
        );
        tl.to(
          cardRefs.current[i],
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
          insertTime + 0.2
        );
      });

      achRefs.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, delay: i * 0.07, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
          }
        );
      });

      [achHeadRef, certHeadRef].forEach((ref) => {
        if (!ref.current) return;
        ref.current.querySelectorAll(".h-rule").forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: "center" },
            {
              scaleX: 1, duration: 1, ease: "expo.out",
              scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none none" },
            }
          );
        });
      });

      certRefs.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(
          el,
          { x: i % 2 === 0 ? 50 : -50, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.65, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", toggleActions: "play none none none" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Responsive column count ──────────────────────────────────────────────
  // ≤3 entries → all in one row
  // 4–5 entries → cap at 3 per row on large screens, wrap naturally
  // This uses CSS for adaptability; GSAP still drives all n entries.
  const n = experience.length;
  const gridCols =
    n <= 3
      ? `repeat(${n}, 1fr)`
      : `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`;

  return (
    <section id="experience" ref={sectionRef} style={{ background: "var(--surface)" }}>
      <GradientOrb x="80%" y="20%" size={500} color="var(--lime)" opacity={0.03} />

      <div className="px-8 md:px-16 pt-24 pb-0">
        <div className="flex items-center gap-4 mb-4">
          <span className="index-num">04</span>
          <div className="rule flex-1" />
          <span className="label text-muted">Journey</span>
        </div>
        <div style={{ overflow: "hidden" }}>
          <h2
            className="display-lg text-offwhite uppercase"
            style={{ display: "block" }}
          >
            Experience
          </h2>
        </div>
      </div>

      <div
        ref={wrapRef}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "var(--surface)",
          overflow: "hidden",
          padding: "0 clamp(32px,8vw,120px)",
        }}
      >
        {/* ── Cards row ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: 20,
            marginBottom: 48,
            alignItems: "flex-end",
          }}
        >
          {experience.map((exp, i) => (
            <div
              key={exp.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-xs)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  exp.status === "UPCOMING"
                    ? "rgba(99,179,237,0.35)"
                    : "rgba(var(--lime-rgb), 0.28)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-xs)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* corner accent */}
              <div
                style={{
                  position: "absolute", top: 0, right: 0, width: 60, height: 60,
                  background:
                    exp.status === "UPCOMING"
                      ? "linear-gradient(225deg,rgba(99,179,237,0.10),transparent 60%)"
                      : "linear-gradient(225deg,rgba(var(--lime-rgb), 0.08),transparent 60%)",
                }}
              />
              <CardContent exp={exp} />
            </div>
          ))}
        </div>

        {/* ── Connectors ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: 20,
            height: 40,
            alignItems: "flex-end",
          }}
        >
          {experience.map((exp, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "center" }}>
              <div
                ref={(el) => (connRefs.current[i] = el)}
                style={{
                  width: 1, height: 40,
                  background:
                    exp.status === "UPCOMING"
                      ? "linear-gradient(to bottom, rgba(99,179,237,0.4), #63B3ED)"
                      : "linear-gradient(to bottom, rgba(var(--lime-rgb), 0.4), var(--lime))",
                  transformOrigin: "bottom center",
                }}
              />
            </div>
          ))}
        </div>

        {/* ── Timeline line + dots ── */}
        <div style={{ position: "relative", height: 32, marginTop: 0 }}>
          <div
            style={{
              position: "absolute", top: "50%", left: 0, right: 0,
              height: 1, background: "var(--border-sm)",
              transform: "translateY(-50%)",
            }}
          />
          <div
            ref={lineRef}
            style={{
              position: "absolute", top: "50%", left: 0, right: 0,
              height: 1,
              background: "linear-gradient(to right, var(--lime), rgba(var(--lime-rgb), 0.4))",
              boxShadow: "0 0 8px rgba(var(--lime-rgb), 0.6)",
              transformOrigin: "left center",
              transform: "translateY(-50%) scaleX(0)",
            }}
          />
          <div
            style={{
              position: "absolute", top: "50%", left: 0, right: 0,
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: 20,
              transform: "translateY(-50%)",
            }}
          >
            {experience.map((exp, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                <div
                  ref={(el) => (dotRefs.current[i] = el)}
                  style={{
                    width: 20, height: 20,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute", width: 20, height: 20, borderRadius: "50%",
                      border: `1px solid ${
                        exp.status === "CURRENT"
                          ? "rgba(var(--lime-rgb), 0.4)"
                          : exp.status === "UPCOMING"
                          ? "rgba(99,179,237,0.4)"
                          : "var(--text-dim)"
                      }`,
                      background: "var(--surface)",
                      animation:
                        exp.status === "CURRENT" || exp.status === "UPCOMING"
                          ? "ringPulse 2s ease-in-out infinite"
                          : "none",
                    }}
                  />
                  <div
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      position: "relative", zIndex: 1,
                      background:
                        exp.status === "CURRENT"
                          ? "var(--lime)"
                          : exp.status === "UPCOMING"
                          ? "#63B3ED"
                          : "var(--text-dim)",
                      boxShadow:
                        exp.status === "CURRENT"
                          ? "0 0 12px rgba(var(--lime-rgb), 1)"
                          : exp.status === "UPCOMING"
                          ? "0 0 12px rgba(99,179,237,0.9)"
                          : "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Period labels ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: 20,
            marginTop: 16,
          }}
        >
          {experience.map((exp, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "center" }}>
              <span
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11, letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                }}
              >
                {exp.period}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%,100% { transform:scale(1);   opacity:0.4; }
          50%      { transform:scale(2.4); opacity:0;   }
        }
      `}</style>

      {/* ── Achievements ── */}
      <div className="px-8 md:px-16 pt-20 mb-24">
        <div ref={achHeadRef} className="flex items-center gap-6 mb-12">
          <div className="h-rule rule flex-1" />
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(22px,3vw,36px)",letterSpacing:"0.08em",color:"var(--offwhite)",whiteSpace:"nowrap" }}>
            Achievements
          </h3>
          <div className="h-rule rule flex-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              ref={(el) => (achRefs.current[i] = el)}
              className="p-6 rounded-xl"
              style={{ background:"var(--card-bg)",border:"1px solid var(--border-xs)",transition:"border-color 0.3s,transform 0.3s,box-shadow 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor="rgba(202,255,0,0.3)";e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor="var(--border-xs)";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"; }}
            >
              <span style={{ fontSize:20,color:"#CAFF00",display:"block",marginBottom:12 }}>{a.icon}</span>
              <h4 className="text-offwhite uppercase mb-2" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(17px,2vw,22px)",letterSpacing:"0.04em" }}>{a.title}</h4>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--muted)" }}>{a.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Certifications ── */}
      <Marquee
        items={certMarqueeItems}
        separator=""
        pauseOnHover
        speed={0.75}
        reactToScroll={false}
        className="py-6"
      />
      <div className="px-8 md:px-16 pb-24">
        <div ref={certHeadRef} className="flex items-center gap-6 mb-12">
          <div className="h-rule rule flex-1" />
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(22px,3vw,36px)",letterSpacing:"0.08em",color:"var(--offwhite)",whiteSpace:"nowrap" }}>
            Certifications
          </h3>
          <div className="h-rule rule flex-1" />
        </div>
        <div className="flex flex-col gap-8">
          {certifications.map((c, i) => (
            <div
              key={i}
              ref={(el) => (certRefs.current[i] = el)}
              className="cert-card"
            >
              <div className="cert-card-left">
                <span className="cert-num">
                  0{i + 1}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h2 className="cert-big-title">{c.name}</h2>
                  <div className="cert-tags">
                    <span className="cert-tag">{c.issuer}</span>
                    <span className="cert-tag">{c.year}</span>
                    <span className="cert-tag">Certified</span>
                  </div>
                </div>
              </div>

              <div className="cert-thumb" style={{ background: certGradients[i % certGradients.length] }}>
                {c.image ? (
                  <img
                    src={c.image}
                    alt={`${c.name} certificate`}
                    className="cert-thumb-img"
                  />
                ) : (
                  <CertSeal />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}