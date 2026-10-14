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
              <span className="hero__title-text">
                <span className="hero__title-line">PHOTO</span>{" "}
                <br className="hero__title-break" />
                <span className="hero__title-line">DREAM</span>
              </span>
              {/* Russo One outlines, viewBox cropped to ink so edges meet the grid */}
              <svg
                className="hero__wordmark"
                viewBox="60 -710 7385 720"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M60 0L60-700L480-700Q585-700 632.50-652.50Q680-605 680-500L680-400Q680-295 632.50-247.50Q585-200 480-200L240-200L240 0L60 0M500-400L500-500Q500-560 440-560L240-560L240-340L440-340Q500-340 500-400M1380-700L1380 0L1200 0L1200-285L950-285L950 0L770 0L770-700L950-700L950-425L1200-425L1200-700L1380-700M1950-190L1950-510Q1950-570 1890-570L1720-570Q1660-570 1660-510L1660-190Q1660-130 1720-130L1890-130Q1950-130 1950-190M2130-510L2130-190Q2130-85 2082.50-37.50Q2035 10 1930 10L1680 10Q1575 10 1527.50-37.50Q1480-85 1480-190L1480-510Q1480-615 1527.50-662.50Q1575-710 1680-710L1930-710Q2035-710 2082.50-662.50Q2130-615 2130-510M2570-560L2570 0L2390 0L2390-560L2180-560L2180-700L2780-700L2780-560L2570-560M3300-190L3300-510Q3300-570 3240-570L3070-570Q3010-570 3010-510L3010-190Q3010-130 3070-130L3240-130Q3300-130 3300-190M3480-510L3480-190Q3480-85 3432.50-37.50Q3385 10 3280 10L3030 10Q2925 10 2877.50-37.50Q2830-85 2830-190L2830-510Q2830-615 2877.50-662.50Q2925-710 3030-710L3280-710Q3385-710 3432.50-662.50Q3480-615 3480-510M3880-700L4270-700Q4383-700 4441.50-641.50Q4500-583 4500-470L4500-230Q4500-117 4441.50-58.50Q4383 0 4270 0L3880 0L3880-700M4320-230L4320-470Q4320-560 4230-560L4060-560L4060-140L4230-140Q4320-140 4320-230M4600 0L4600-700L5020-700Q5125-700 5172.50-652.50Q5220-605 5220-500L5220-410Q5220-327 5192.50-281Q5165-235 5105-220L5230 0L5035 0L4920-210L4780-210L4780 0L4600 0M5040-410L5040-500Q5040-560 4980-560L4780-560L4780-350L4980-350Q5040-350 5040-410M5875-140L5875 0L5320 0L5320-700L5875-700L5875-560L5500-560L5500-425L5795-425L5795-285L5500-285L5500-140L5875-140M6125-125L6080 0L5885 0L6150-700L6350-700L6615 0L6420 0L6375-125L6125-125M6250-490L6170-255L6330-255L6250-490M7265 0L7265-390L7125-140L6985-140L6845-390L6845 0L6665 0L6665-700L6855-700L7055-330L7255-700L7445-700L7445 0"
                />
              </svg>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
