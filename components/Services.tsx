"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ServiceItem = {
  id: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  /** Wire up when a detail page exists */
  href?: string;
};

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

const SERVICES: ServiceItem[] = [
  {
    id: "rent",
    title: "Аренда студии",
    text: "Пространство для твоей съёмки и собственных идей.",
    image: imagePath("Аренда студии.jpg"),
    imageAlt: "Аренда студии — пространство для съёмки",
  },
  {
    id: "photographer",
    title: "Студия с фотографом",
    text: "Съёмка с фотографом для тех, кто хочет получить готовые кадры.",
    image: imagePath("Студия с фотографом.png"),
    imageAlt: "Студия с фотографом — готовые кадры",
  },
  {
    id: "zone",
    title: "Фотозона",
    text: "Выбери подходящее пространство для своего визуального замысла.",
    image: imagePath("Фотозона2.jpg"),
    imageAlt: "Фотозона — пространство для визуального замысла",
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
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
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

function ServiceMore({ href, label = "Подробнее" }: { href?: string; label?: string }) {
  const content = (
    <>
      {label}
      <span className="services__more-arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  if (href) {
    return (
      <a className="services__more" href={href}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="services__more" disabled aria-disabled="true">
      {content}
    </button>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="services site-section"
      aria-labelledby="services-heading"
    >
      <div className="site-grid services__grid">
        <Reveal className="services__intro services-reveal services-reveal--from-left">
          <div className="services__heading-group">
            <h2 id="services-heading" className="services__heading">
              Выбирай свой формат
            </h2>
            <span
              className="heading-rule services__heading-rule"
              aria-hidden="true"
            />
          </div>
          <p className="services__lead">
            Всё необходимое для съёмки –
            <br />
            в одном пространстве.
          </p>
        </Reveal>

        <Reveal className="services__item services__item--1 services-reveal services-reveal--from-left">
          <div className="services__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SERVICES[0].image}
              alt={SERVICES[0].imageAlt}
              className="services__image"
            />
          </div>
          <div className="services__body">
            <h3 className="services__title">{SERVICES[0].title}</h3>
            <p className="services__text">{SERVICES[0].text}</p>
            <ServiceMore href={SERVICES[0].href} />
          </div>
        </Reveal>

        <Reveal className="services__item services__item--2 services-reveal services-reveal--from-right">
          <div className="services__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SERVICES[1].image}
              alt={SERVICES[1].imageAlt}
              className="services__image"
            />
          </div>
          <div className="services__body">
            <h3 className="services__title">{SERVICES[1].title}</h3>
            <p className="services__text">{SERVICES[1].text}</p>
            <ServiceMore href={SERVICES[1].href} />
          </div>
        </Reveal>

        <Reveal className="services__item services__item--3 services-reveal services-reveal--from-up">
          <div className="services__media services__media--wide">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SERVICES[2].image}
              alt={SERVICES[2].imageAlt}
              className="services__image"
            />
          </div>
          <div className="services__body services__body--wide">
            <h3 className="services__title">{SERVICES[2].title}</h3>
            <p className="services__text">{SERVICES[2].text}</p>
            <ServiceMore href={SERVICES[2].href} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
