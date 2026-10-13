"use client";

import { useEffect, useRef, useState } from "react";

type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
  imageAlt: string;
};

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

const REVIEWS: Review[] = [
  {
    id: "alina",
    name: "Алина Морозова",
    text: "Очень красивое пространство! Понравилось, что можно экспериментировать со светом и менять образы прямо во время съёмки. Получились совершенно разные кадры, хотя снимались в одной студии. Обязательно вернусь ещё!",
    rating: 5,
    image: imagePath("reviews/Алина.png"),
    imageAlt: "Алина Морозова — портрет клиента PHOTO DREAM",
  },
  {
    id: "maxim",
    name: "Максим Орлов",
    text: "Арендовали студию для съёмки бренда одежды. Много естественного света, стильный интерьер и достаточно места для команды. Всё прошло спокойно, без суеты. Результатом остались довольны и мы, и клиент.",
    rating: 5,
    image: imagePath("reviews/Максим.png"),
    imageAlt: "Максим Орлов — портрет клиента PHOTO DREAM",
  },
  {
    id: "sofia",
    name: "София Белова",
    text: "Давно хотела устроить себе красивую фотосессию, и это было отличным решением. Атмосфера очень комфортная, ничего не отвлекает от процесса. Время пролетело незаметно, а фотографии получились именно такими, как я представляла.",
    rating: 5,
    image: imagePath("reviews/София.png"),
    imageAlt: "София Белова — портрет клиента PHOTO DREAM",
  },
  {
    id: "artem",
    name: "Артём Ковалёв",
    text: "Приходил снимать контент для личного блога. Удобно, что в одном пространстве можно сделать кадры с совершенно разным настроением. Свет и оборудование помогли воплотить задумку без лишних сложностей. Отличное место для творческих проектов.",
    rating: 5,
    image: imagePath("reviews/Артём.png"),
    imageAlt: "Артём Ковалёв — портрет клиента PHOTO DREAM",
  },
  {
    id: "darya",
    name: "Дарья Новикова",
    text: "Искали студию для съёмки команды и остались очень довольны. Красивое пространство, приятный свет и много возможностей для разных кадров. Фотографии получились живыми, не слишком постановочными — именно то, что нам было нужно.",
    rating: 5,
    image: imagePath("reviews/Дарья.png"),
    imageAlt: "Дарья Новикова — портрет клиента PHOTO DREAM",
  },
];

function ReviewPanel({
  item,
  hidden,
  className,
}: {
  item: Review;
  hidden: boolean;
  className?: string;
}) {
  return (
    <aside
      className={className ? `reviews__panel ${className}` : "reviews__panel"}
      aria-hidden={hidden}
      aria-live="polite"
    >
      <h3 className="reviews__name">{item.name}</h3>
      <div className="reviews__stars" aria-label={`${item.rating} из 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`reviews__star${i < item.rating ? " is-on" : ""}`}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
      <p className="reviews__text">«{item.text}»</p>
    </aside>
  );
}

export default function Reviews() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(REVIEWS[0].id);
  const [revealed, setRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const active = REVIEWS.find((item) => item.id === activeId) ?? REVIEWS[0];

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 700px)");
    const syncMobile = () => setIsMobile(mobile.matches);
    syncMobile();
    mobile.addEventListener("change", syncMobile);
    return () => mobile.removeEventListener("change", syncMobile);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activate = (id: string) => {
    setActiveId(id);
  };

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className={`reviews${revealed ? " is-revealed" : ""}`}
      aria-label="Отзывы"
    >
      <div className="reviews__inner">
        <header className="reviews__header reviews-reveal">
          <h2 className="reviews__heading">Отзывы</h2>
        </header>

        <div
          className="reviews__rail reviews-reveal"
          role="listbox"
          aria-label="Портреты клиентов"
          aria-activedescendant={`review-shot-${activeId}`}
        >
          {REVIEWS.map((item, index) => {
            const isActive = item.id === activeId;
            return (
              <div
                key={item.id}
                className={`reviews__slot${isActive ? " is-active" : ""}`}
              >
                <button
                  id={`review-shot-${item.id}`}
                  type="button"
                  role="option"
                  aria-label={item.name}
                  aria-selected={isActive}
                  className={`reviews__shot${isActive ? " is-active" : ""}`}
                  style={{ ["--reviews-delay" as string]: `${80 + index * 45}ms` }}
                  onMouseEnter={() => activate(item.id)}
                  onFocus={() => activate(item.id)}
                  onClick={() => activate(item.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="reviews__shot-image"
                    width={896}
                    height={1120}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </button>

                <ReviewPanel
                  item={item}
                  hidden={!isActive || isMobile}
                  className="reviews__panel--rail"
                />
              </div>
            );
          })}
        </div>

        <div
          className="reviews__mobile-detail reviews-reveal"
          aria-hidden={!isMobile}
        >
          <figure className="reviews__feature">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={active.id}
              src={active.image}
              alt=""
              className="reviews__feature-image"
              width={896}
              height={1120}
              decoding="async"
            />
          </figure>
          <ReviewPanel
            item={active}
            hidden={!isMobile}
            className="reviews__panel--mobile"
          />
        </div>
      </div>
    </section>
  );
}
