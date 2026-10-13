"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const scaleNode = scaleRef.current;
    if (!hero || !scaleNode) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const range = Math.max(rect.height * 0.85, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      /* Shrink toward center: 1 → ~0.72 */
      const scale = 1 - progress * 0.28;
      scaleNode.style.transform = `scale(${scale})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="top" ref={heroRef} className="hero" aria-label="Главный экран">
      <div className="hero__media" aria-hidden="true">
        <div className="hero__image" />
        <div className="hero__overlay" />
      </div>

      <div className="hero__stage">
        <div className="hero__copy hero-reveal hero-reveal--1">
          <p className="hero__copy-lead">Место, где начинается съёмка.</p>
          <p className="hero__copy-meta">Москва, м. Воробьёвы горы</p>
          <p className="hero__copy-meta">от 999 ₽ / час</p>
        </div>

        <aside className="hero__ticket hero-reveal hero-reveal--2" aria-label="Бронирование">
          <div className="hero__ticket-main">
            <div className="hero__ticket-media">
              {/* Prefer public/images/studio-ticket.jpg when available */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/${encodeURIComponent("Фотозона2.jpg")}`}
                alt=""
                className="hero__ticket-image"
                width={320}
                height={200}
              />
            </div>

            <div className="hero__ticket-body">
              <h2 className="hero__ticket-title">ТВОЯ СЪЁМКА НАЧИНАЕТСЯ ЗДЕСЬ</h2>
              <p className="hero__ticket-caption">
                ВЫБЕРИ ПРОСТРАНСТВО ДЛЯ СВОЕЙ ИДЕИ
              </p>
            </div>
          </div>

          <div className="hero__ticket-perf" aria-hidden="true" />

          <div className="hero__ticket-foot">
            {/* Booking form section TBD — temporary anchor */}
            <a href="#booking" className="hero__ticket-cta">
              ЗАБРОНИРОВАТЬ →
            </a>
          </div>
        </aside>

        {/* Mobile-only CTA — replaces ticket card */}
        <a href="#booking" className="hero__book-btn">
          ЗАБРОНИРОВАТЬ
          <span aria-hidden="true">→</span>
        </a>

        <div className="hero__marquee">
          <div className="hero__rule" aria-hidden="true" />
          <div ref={scaleRef} className="hero__title-scale">
            <h1 className="hero__title hero-reveal hero-reveal--3">
              <span className="hero__title-line">PHOTO</span>{" "}
              <br className="hero__title-break" />
              <span className="hero__title-line">DREAM</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
