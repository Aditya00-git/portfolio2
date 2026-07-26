import { useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import SplitLines from "../components/SplitLines";

import { socials } from "../constants";

/* ─── Social icon paths ─── */
const ICONS = {
  GitHub: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  LinkedIn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  "Twitter / X": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
};

/* ─── Small round social icon button used inside the profile card (Shan-style) ─── */
const SocialIconBtn = ({ social }) => (
  <a
    href={social.href}
    target="_blank"
    rel="noreferrer"
    data-cursor
    aria-label={social.name}
    style={{
      width: 40, height: 40, borderRadius: 10,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "var(--offwhite)", color: "var(--charcoal)",
      transition: "background 0.3s, color 0.3s, transform 0.3s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "var(--lime)";
      e.currentTarget.style.transform = "translateY(-3px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "var(--offwhite)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    {ICONS[social.name]}
  </a>
);

const quickLinks = [
  { label: "Home",       id: "home"       },
  { label: "About Me",   id: "about"      },
  { label: "Projects",   id: "projects"   },
  { label: "Experience", id: "experience" },
  { label: "Contact",    id: "contact"    },
];

gsap.registerPlugin(ScrollTrigger);

/* ─── The actual form — isolated so useForm hook is clean ─── */
const ContactForm = () => {
  const [state, handleSubmit] = useForm("xvzbryvq");
  const formItemRefs = useRef([]);

  const fields = [
    { name: "name",  placeholder: "First Name",    type: "text",  label: "Name"  },
    { name: "email", placeholder: "Email Address", type: "email", label: "Email" },
  ];

  if (state.succeeded) {
    return (
      <div className="flex flex-col gap-6 justify-center" style={{ minHeight: 320 }}>
        <div
          style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(202,255,0,0.1)",
            border: "1px solid rgba(202,255,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26,
          }}
        >✓</div>
        <div>
          <p style={{ fontFamily: "'Phudu', sans-serif", fontSize: "clamp(28px,4vw,52px)", color: "var(--lime)", letterSpacing: "0.04em", lineHeight: 1 }}>
            Message sent.
          </p>
          <p className="body-lg mt-3" style={{ color: "var(--text-dim)", lineHeight: 1.8 }}>
            Thanks for reaching out — I'll reply within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>

      {fields.map((f, i) => (
        <div key={f.name} ref={el => (formItemRefs.current[i] = el)}>
          <div
            className="relative rounded-lg"
            style={{ border: "1px solid var(--border-sm)", background: "var(--card-bg)", transition: "border-color 0.35s" }}
            onFocusCapture={e => (e.currentTarget.style.borderColor = "var(--lime)")}
            onBlurCapture={e => (e.currentTarget.style.borderColor = "var(--border-sm)")}
          >
            <input
              id={f.name}
              type={f.type}
              name={f.name}
              required
              placeholder={f.placeholder}
              disabled={state.submitting}
              className="w-full bg-transparent outline-none"
              style={{
                fontFamily: "'Instrument Sans', sans-serif",
                fontSize: "clamp(15px,1.6vw,17px)",
                color: "var(--offwhite)",
                fontWeight: 300,
                padding: "18px 20px",
                opacity: state.submitting ? 0.4 : 1,
                transition: "opacity 0.3s",
              }}
            />
          </div>
          <ValidationError
            prefix={f.label}
            field={f.name}
            errors={state.errors}
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ff6b6b",
              marginTop: 6,
              display: "block",
            }}
          />
        </div>
      ))}

      {/* Textarea */}
      <div ref={el => (formItemRefs.current[2] = el)}>
        <div
          className="relative rounded-lg"
          style={{ border: "1px solid var(--border-sm)", background: "var(--card-bg)", transition: "border-color 0.35s" }}
          onFocusCapture={e => (e.currentTarget.style.borderColor = "var(--lime)")}
          onBlurCapture={e => (e.currentTarget.style.borderColor = "var(--border-sm)")}
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Message"
            disabled={state.submitting}
            className="w-full bg-transparent outline-none resize-none"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(15px,1.6vw,17px)",
              color: "var(--offwhite)",
              fontWeight: 300,
              padding: "18px 20px",
              opacity: state.submitting ? 0.4 : 1,
              transition: "opacity 0.3s",
            }}
          />
        </div>
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#ff6b6b",
            marginTop: 6,
            display: "block",
          }}
        />
      </div>

      {/* Submit */}
      <button
        ref={el => (formItemRefs.current[3] = el)}
        type="submit"
        disabled={state.submitting}
        data-cursor
        className="w-full rounded-lg"
        style={{
          cursor: "none",
          border: "none",
          padding: "18px 20px",
          background: "var(--lime)",
          color: "var(--charcoal)",
          fontFamily: "'Instrument Sans', sans-serif",
          fontWeight: 700,
          fontSize: "clamp(14px,1.4vw,17px)",
          textTransform: "lowercase",
          letterSpacing: "0.02em",
          opacity: state.submitting ? 0.6 : 1,
          transition: "background 0.3s, opacity 0.3s",
        }}
        onMouseEnter={e => { if (!state.submitting) e.target.style.background = "var(--offwhite)"; }}
        onMouseLeave={e => { e.target.style.background = "var(--lime)"; }}
      >
        {state.submitting ? "sending..." : "submit message"}
      </button>
    </form>
  );
};

/* ─── Main Contact section ─── */
const Contact = () => {
  const sectionRef = useRef(null);
  const dotRef     = useRef(null);
  const cardRef    = useRef(null);
  const footerRef  = useRef(null);

  useGSAP(() => {
    // Status dot pulse
    gsap.to(dotRef.current, {
      scale: 1.6, repeat: -1, yoyo: true, duration: 0.9, ease: "power1.inOut",
    });

    // Section slides up
    gsap.fromTo(sectionRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 88%", toggleActions: "play none none none" },
      }
    );

    // Profile card
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, delay: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: cardRef.current, start: "top 90%", toggleActions: "play none none none" },
        }
      );
    }

    // Footer
    if (footerRef.current) {
      gsap.fromTo(footerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 95%", toggleActions: "play none none none" },
        }
      );
    }
  });

  return (
    <section id="contact" style={{ background: "var(--charcoal)" }}>

      {/* ══ CONTACT SECTION — Shan-style: heading + profile card + form ══ */}
      <div
        ref={sectionRef}
        className="py-24 px-8 md:px-16"
        style={{ borderTop: "1px solid var(--border-sm)" }}
      >
        <div className="flex items-center gap-4 mb-16">
          <span className="index-num">05</span>
          <div className="rule flex-1" />
          <span className="label text-muted">Contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <SplitLines
              text={`Let's create\nsomething\nmeaningful`}
              className="text-offwhite uppercase mb-8"
              trigger={false}
              delay={0}
              style={{ fontFamily: "'Phudu', sans-serif", fontSize: "clamp(32px,5vw,64px)", lineHeight: 1 }}
            />

            <div className="flex items-center gap-4 mb-4">
              <div
                ref={dotRef}
                className="w-3 h-3 rounded-full"
                style={{ background: "var(--lime)", boxShadow: "0 0 12px rgba(202,255,0,0.6)" }}
              />
              <span className="label text-muted">Currently accepting projects</span>
            </div>

            <a
              href="mailto:seswaniaditya@gmail.com"
              className="body-lg transition-colors duration-300"
              style={{ color: "var(--lime)", fontWeight: 600 }}
              onMouseEnter={e => e.target.style.color = "var(--offwhite)"}
              onMouseLeave={e => e.target.style.color = "var(--lime)"}
              data-cursor
            >
              seswaniaditya@gmail.com
            </a>

            {/* Profile card */}
            <div
              ref={cardRef}
              className="mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-lg text-center sm:text-left"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border-xs)" }}
            >
              <div
                className="rounded-lg overflow-hidden flex-shrink-0"
                style={{ width: 120, height: 120 }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}images/afinal 3.png`}
                  alt="Aditya Seswani"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between items-center sm:items-start w-full min-w-0">
                <div>
                  <h3
                    className="text-offwhite"
                    style={{ fontFamily: "'Phudu', sans-serif", fontSize: "clamp(20px,2.2vw,26px)", letterSpacing: "0.04em" }}
                  >
                    Aditya
                  </h3>
                  <p style={{ color: "var(--text-dim)", fontFamily: "'Instrument Sans', sans-serif", fontSize: 14 }}>
                    Full Stack Developer
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-4 sm:mt-0">
                  {socials.map((s, i) => <SocialIconBtn key={i} social={s} />)}
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <ContactForm />
        </div>
      </div>

      {/* ══ FOOTER BAR — socials / back-to-top circle / copyright ══ */}
      <div
        ref={footerRef}
        className="footer-bar px-8 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
        style={{ borderTop: "1px solid var(--border-sm)", borderBottom: "1px solid var(--border-sm)" }}
      >
        <div className="flex flex-col gap-3 items-center md:items-start">
          <h4
            className="text-offwhite"
            style={{ fontFamily: "'Phudu', sans-serif", fontSize: "clamp(18px,2vw,24px)", fontWeight: 600 }}
          >
            Quick Links
          </h4>
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            {quickLinks.map((l, i) => (
              <a
                key={i}
                href={`#${l.id}`}
                data-cursor
                onClick={e => {
                  e.preventDefault();
                  const smoother = ScrollSmoother.get();
                  if (smoother) smoother.scrollTo(`#${l.id}`, true, "top 80px");
                  else document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: "clamp(15px,1.6vw,18px)",
                  color: "var(--offwhite)",
                  transition: "color 0.3s",
                }}
                onMouseEnter={e => e.target.style.color = "var(--lime)"}
                onMouseLeave={e => e.target.style.color = "var(--offwhite)"}
              >
                {l.label}{i < quickLinks.length - 1 ? "," : ""}
              </a>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="footer-back-to-top"
          aria-label="Back to top"
          onClick={() => {
            const smoother = ScrollSmoother.get();
            if (smoother) smoother.scrollTo(0, true);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="text-center md:text-right">
          <h4
            className="text-offwhite uppercase"
            style={{ fontFamily: "'Phudu', sans-serif", fontSize: "clamp(18px,2vw,24px)", letterSpacing: "0.04em", marginBottom: 4 }}
          >
            Aditya Portfolio
          </h4>
          <p className="label text-muted">© 2026 Aditya Seswani. All rights reserved</p>
        </div>
      </div>

      {/* ══ Giant name banner ══ */}
      <div className="footer-name-banner px-8 md:px-16 py-16" style={{ overflow: "hidden" }}>
        <h2
          className="display-lg text-offwhite uppercase"
          style={{ display: "block", textAlign: "center" }}
        >
          ADI
        </h2>
      </div>
    </section>
  );
};

export default Contact;