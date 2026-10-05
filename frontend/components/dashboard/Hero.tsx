"use client";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
export default function Hero() {
  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="pill">MAKE THINGS HAPPEN.</span>
        <h2>
          Big ideas.
          <br />
          <span>Small steps.</span>
        </h2>
        <p>Clear your head. Pick a task. Make a little progress.</p>
        <Link className="button hero-button" href="/tasks">
          Keep it going
          <Icon name="arrow" />
        </Link>
      </div>
      <div className="hero-art" aria-hidden="true">
        <span className="art-star">✳</span>
        <div className="art-window">
          <div className="art-window-head">
            <i />
            <i />
            <i />
            <span>PLAN. DO. REPEAT.</span>
          </div>
          <div className="art-line">
            <span className="art-checkbox">✓</span>
            <span className="art-stroke" />
          </div>
          <div className="art-line">
            <span className="art-checkbox">✓</span>
            <span className="art-stroke short" />
          </div>
          <div className="art-line">
            <span className="art-checkbox empty" />
            <span className="art-stroke" />
          </div>
        </div>
        <span className="art-sticker">
          GOOD
          <br />
          THINGS
          <br />
          AHEAD ↗
        </span>
        <span className="art-squiggle">〰</span>
      </div>
    </section>
  );
}
