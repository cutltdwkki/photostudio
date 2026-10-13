"use client";

import { useEffect, useRef, type ReactNode } from "react";
import StudioSlider, { type StudioSlide } from "./StudioSlider";

const BLOCKS = [
  {
    number: "01",
    title: "Место, где начинается съёмка.",
    text: "Фотостудия в Москве для тех, кто хочет воплощать свои идеи в кадре — от личных портретов до съёмок для брендов.",
    reveal: "left" as const,
  },
  {
    number: "02",
    title: "Твой замысел. Твой стиль.",
    text: "Экспериментируй с образами, ищи необычные ракурсы, работай со светом и создавай кадры, которые передают именно твоё видение.",
    reveal: "right" as const,
  },
  {
    number: "03",
    title: "Студия на твоих условиях.",
    text: "Забронируй пространство на нужное количество часов и используй это время для своей съёмки — в собственном темпе и по своему сценарию.",
    reveal: "up" as const,
  },
] as const;

/**
 * Existing project images only. Add more studio photos to expand the slider:
 * /public/images/studio-01.jpg
 * /public/images/studio-02.jpg
 * /public/images/studio-03.jpg
 * /public/images/studio-04.jpg
 */
const SLIDES: StudioSlide[] = [
  {
    src: "/images/hero.png",
    alt: "Интерьер фотостудии — свет и пространство для съёмки",
  },
  {
    src: "/images/hero.png",
    alt: "Интерьер фотостудии — ракурс со светом",
  },
  {
    src: "/images/hero.png",
    alt: "Интерьер фотостудии — пространство для кадра",
  },
];

function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-visible");
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function Reveal({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function Studio() {
  return (
    <section id="studio" className="studio site-section" aria-labelledby="studio-heading">
      <div className="site-grid studio__grid">
        <Reveal className="studio__heading-wrap studio-reveal studio-reveal--from-left">
          <h2 id="studio-heading" className="studio__heading">
            Пространство
            <br />
            для твоих идей
          </h2>
          <span className="heading-rule studio__heading-rule" aria-hidden="true" />
        </Reveal>

        {BLOCKS.map((block, i) => (
          <Reveal
            key={block.number}
            className={`studio__block studio__block--${i + 1} studio-reveal studio-reveal--from-${block.reveal}`}
          >
            <p className="studio__block-number">{block.number}</p>
            <span className="heading-rule studio__block-mark" aria-hidden="true" />
            <h3 className="studio__block-title">{block.title}</h3>
            <p className="studio__block-text">{block.text}</p>
          </Reveal>
        ))}

        <Reveal className="studio__slider-caption studio-reveal studio-reveal--from-left">
          <p className="studio__slider-label">Каждый угол — новый кадр</p>
        </Reveal>
      </div>

      <Reveal className="studio__slider-bleed studio-reveal studio-reveal--from-up">
        <StudioSlider slides={SLIDES} />
      </Reveal>
    </section>
  );
}
