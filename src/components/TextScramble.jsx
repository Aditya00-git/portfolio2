import { useRef, useEffect } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";

const TextScramble = ({
  text,
  tag: Tag = "span",
  className = "",
  style = {},
  scrambleOnMount = false,
  fit = false, // shrink font-size just enough to keep `text` on one line
}) => {
  const el = useRef(null);
  const raf = useRef(null);
  const iteration = useRef(0);

  const scramble = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    iteration.current = 0;

    const step = () => {
      if (!el.current) return;
      el.current.textContent = text
        .split("")
        .map((c, i) => {
          if (c === " ") return " ";
          if (i < iteration.current) return c;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iteration.current < text.length) {
        iteration.current += 0.35;
        raf.current = requestAnimationFrame(step);
      } else {
        el.current.textContent = text;
      }
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (scrambleOnMount) {
      const t = setTimeout(scramble, 400);
      return () => clearTimeout(t);
    }
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [scrambleOnMount, text]);

  // ── Auto-fit: shrink font-size so `text` never overflows its container ──
  useEffect(() => {
    if (!fit) return;
    const node = el.current;
    if (!node) return;

    const runFit = () => {
      const parent = node.parentElement;
      if (!parent) return;
      node.style.fontSize = ""; // reset to the CSS-defined size before measuring
      const available = parent.clientWidth;
      const natural = node.scrollWidth;
      if (available > 0 && natural > available) {
        const base = parseFloat(getComputedStyle(node).fontSize);
        const scale = (available / natural) * 0.985; // small safety margin
        node.style.fontSize = `${base * scale}px`;
      }
    };

    runFit();
    document.fonts?.ready?.then(runFit); // re-check once web fonts finish loading
    window.addEventListener("resize", runFit);
    return () => window.removeEventListener("resize", runFit);
  }, [fit, text]);

  return (
    <Tag
      ref={el}
      className={className}
      style={{ cursor: "default", ...style }}
      onMouseEnter={scramble}
    >
      {text}
    </Tag>
  );
};

export default TextScramble;