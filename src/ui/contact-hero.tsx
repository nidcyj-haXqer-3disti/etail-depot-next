import { brandSymbol } from "../shared/ui/artwork/artwork-assets";
import { preload } from "react-dom";
import styles from "./contact-hero.module.css";

function ContactIllustration() {
  preload(brandSymbol.src, { as: "image" });
  return <div className={styles.art} aria-hidden="true">
    <svg viewBox="0 0 500 330" fill="none" focusable="false" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="254" cy="179" rx="174" ry="137" fill="#eff4e8" />
      <ellipse cx="253" cy="299" rx="150" ry="10" fill="#dfe8d8" opacity=".6" />
      <path d="M92 147 239 61Q250 54 261 61L408 147V273H92Z" fill="#254d3f" />
      <path d="m92 147 158 89 158-89" stroke="#47705a" strokeWidth="1.2" />
      <g transform="rotate(-7 250 145)">
        <rect x="143" y="44" width="214" height="211" rx="12" fill="#fff" stroke="#cbd8c5" strokeWidth="1.2" />
        <image href={brandSymbol.src} x="169" y="68" width="66" height="40" />
        <path d="M170 135h129M170 151h93" stroke="#dce6d7" strokeWidth="6" strokeLinecap="round" />
      </g>
      <path d="M92 147 250 235 408 147V273a13 13 0 0 1-13 13H105a13 13 0 0 1-13-13Z" fill="#cbdcbb" />
      <path d="m408 147-158 88 145 51a13 13 0 0 0 13-13Z" fill="#b8cfa8" />
      <path d="m93 276 145-83q12-7 24 0l145 83a13 13 0 0 1-12 10H105a13 13 0 0 1-12-10Z" fill="#e4edda" />
      <path d="m94 276 144-83q12-7 24 0l144 83" stroke="#afc49d" strokeWidth="1.2" />
      <path d="M105 286h290" stroke="#b5c9a6" strokeWidth="1.2" />
    </svg>
  </div>;
}

export function ContactHero({ heading, intro }: { heading: string; intro: string }) {
  return <section className={styles.hero} aria-labelledby="contact-title">
    <div className={styles.layout}>
      <div className={styles.copy}>
        <h1 className={styles.title} id="contact-title">{heading}</h1>
        <p className={styles.intro}>{intro}</p>
      </div>
      <ContactIllustration />
    </div>
  </section>;
}
