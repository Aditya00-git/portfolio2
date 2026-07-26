import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import MagneticBtn from "../components/MagneticBtn";
import { socials } from "../constants";
import ThemeToggle from "../components/ThemeToggle";

const Navbar = () => {
  const panelRef    = useRef(null);
  const leftBgRef   = useRef(null);   // curtain: nav-side panel bg (60%)
  const rightBgRef  = useRef(null);   // curtain: info-side panel bg (40%)
  const linksRef    = useRef([]);
  const metaRef     = useRef(null);
  const tlRef       = useRef(null);
  const iconTopRef  = useRef(null);
  const iconBotRef  = useRef(null);
  const iconTl      = useRef(null);
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    // Curtains start collapsed to 0 height, anchored top / bottom (Shan-style)
    gsap.set(leftBgRef.current,  { scaleY: 0, transformOrigin: "top center" });
    gsap.set(rightBgRef.current, { scaleY: 0, transformOrigin: "bottom center" });
    gsap.set([...linksRef.current.filter(Boolean), metaRef.current], {
      autoAlpha: 0, y: 24,
    });

    tlRef.current = gsap.timeline({ paused: true })
      .to(leftBgRef.current, {
        scaleY: 1, duration: 0.8, ease: "power4.inOut",
      }, 0)
      .to(rightBgRef.current, {
        scaleY: 1, duration: 0.8, ease: "power4.inOut",
      }, 0.08)
      .to(linksRef.current.filter(Boolean), {
        autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.55, ease: "power3.out",
      }, "-=0.35")
      .to(metaRef.current, {
        autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out",
      }, "-=0.25");

    iconTl.current = gsap.timeline({ paused: true })
      .to(iconTopRef.current, { rotate: 45,  y:  4, duration: 0.3, ease: "power2.inOut" })
      .to(iconBotRef.current, { rotate: -45, y: -4, duration: 0.3, ease: "power2.inOut" }, "<");
  }, []);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const cur = window.scrollY;
      setVisible(cur < last || cur < 60);
      last = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    if (open) { tlRef.current.reverse(); iconTl.current.reverse(); }
    else       { tlRef.current.play();   iconTl.current.play();    }
    setOpen(p => !p);
  };

  const goToSection = (id) => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(`#${id}`, true, "top 80px");
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    toggle();
  };

  const sections = ["home", "about", "projects", "experience", "contact"];

  return (
    <>
      <div
        ref={panelRef}
        className="fixed inset-0 z-50"
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        {/* Curtain backgrounds — grow from 0 height like Shan's offcanvas-2 */}
        <div
          ref={leftBgRef}
          className="fixed top-0 left-0 h-full w-full md:w-[60%]"
          style={{ background: "var(--charcoal)", willChange: "transform" }}
        />
        <div
          ref={rightBgRef}
          className="fixed top-0 right-0 h-full hidden md:block"
          style={{ width: "40%", background: "#171717", willChange: "transform" }}
        />

        {/* Nav links — sit on top of the left curtain */}
        <div
          className="fixed top-0 left-0 h-full flex flex-col px-8 md:px-16 w-full md:w-[60%]"
          style={{ paddingTop: 88, paddingBottom: 40, overflow: "hidden" }}
        >
          <nav className="flex flex-col justify-center flex-1 gap-0 min-h-0">
            {sections.map((s, i) => (
              <div
                key={s}
                ref={el => (linksRef.current[i] = el)}
                className="border-b"
                style={{ borderColor: "var(--border-sm)" }}
              >
                <button
                  type="button"
                  onClick={() => goToSection(s)}
                  className="group flex items-center justify-between cursor-none w-full text-left"
                  style={{ padding: "12px 0", background: "transparent", border: "none" }}
                  data-cursor
                >
                  <span className="index-num mr-6 shrink-0">0{i + 1}</span>
                  <span
                    className="flex-1 uppercase transition-colors duration-300 group-hover:text-lime"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(28px, 5.5vw, 72px)",
                      lineHeight: 1,
                      color: "var(--offwhite)",
                    }}
                  >
                    {s}
                  </span>
                  <span
                    className="text-lime opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                    style={{ fontSize: "clamp(16px, 2vw, 24px)" }}
                  >→</span>
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Info column — sits on top of the right curtain (matches Shan's contact/socials panel) */}
        <div
          ref={metaRef}
          className="fixed top-0 right-0 h-full hidden md:flex flex-col justify-end"
          style={{ width: "40%", padding: "100px 60px 60px 50px" }}
        >
          <div>
            <p className="label mb-3" style={{ color: "rgba(240,237,230,0.6)" }}>Socials</p>
            <div className="flex flex-wrap gap-5 mb-8">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label transition-all duration-300"
                  style={{ color: "rgba(240,237,230,0.7)" }}
                  onMouseEnter={e => { e.target.style.color = "#CAFF00"; e.target.style.letterSpacing = "0.26em"; }}
                  onMouseLeave={e => { e.target.style.color = "rgba(240,237,230,0.7)"; e.target.style.letterSpacing = "0.2em"; }}
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
            <p className="label" style={{ color: "rgba(240,237,230,0.4)" }}>© 2026 Aditya Seswani</p>
          </div>
        </div>
      </div>
      <header
        className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-8 md:px-16 py-5 transition-transform duration-500"
        style={{
          transform: visible ? "translateY(0)" : "translateY(-110%)",
          background: open ? "transparent" : "transparent",
        }}
      >
        <div
          className="label transition-colors duration-300"
          style={{ color: open ? "var(--text-bio)" : "var(--text-bio)" }}
        >
          Aditya.dev
        </div>
        <ThemeToggle />

        <MagneticBtn strength={0.45}>
          <button
            onClick={toggle}
            className="w-11 h-11 rounded-full flex flex-col items-center justify-center gap-[5px] border transition-all duration-300"
            style={{
              background: open ? "#CAFF00" : "var(--card-bg)",
              borderColor: open ? "#CAFF00" : "var(--border)",
              cursor: "none",
            }}
            data-cursor
          >
            <span
              ref={iconTopRef}
              className="block w-5 h-px rounded-full origin-center"
              style={{ background: open ? "var(--charcoal)" : "var(--offwhite)", transition: "background 0.3s" }}
            />
            <span
              ref={iconBotRef}
              className="block w-5 h-px rounded-full origin-center"
              style={{ background: open ? "var(--charcoal)" : "var(--offwhite)", transition: "background 0.3s" }}
            />
          </button>
        </MagneticBtn>
      </header>
    </>
  );
};

export default Navbar;