"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

type Tone = "dark" | "light";

type TextCard = {
  kind: "text";
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  tone: Tone;
  date: string;
};

type PhotoCard = {
  kind: "photo";
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  tone: Tone;
  image: string;
  imageAlt: string;
  date: string;
};

type AudioCard = {
  kind: "audio";
  id: string;
  name: string;
  rating: number;
  avatar: string;
  date: string;
};

type VideoCard = {
  kind: "video";
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  tone: Tone;
  image: string;
  imageAlt: string;
  date: string;
};

type ClipCard = {
  kind: "clip";
  id: string;
  name: string;
  rating: number;
  image: string;
  imageAlt: string;
  date: string;
};

type ReviewCard = TextCard | PhotoCard | AudioCard | VideoCard | ClipCard;

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

/**
 * Existing demo reviews. Names and texts are sample copy already in the
 * project — not presented as verified client reviews.
 * Dates are sample labels and all fall before 14.10.2026.
 */
const studio = (filename: string) => imagePath(filename);

const CARDS: ReviewCard[] = [
  {
    kind: "text",
    id: "alina",
    name: "Алина Морозова",
    text: "Очень красивое пространство! Понравилось, что можно экспериментировать со светом и менять образы прямо во время съёмки. Получились совершенно разные кадры, хотя снимались в одной студии. Обязательно вернусь ещё!",
    rating: 5,
    avatar: imagePath("reviews/Алина.png"),
    tone: "dark",
    date: "3 мар. 2026",
  },
  {
    kind: "clip",
    id: "ksenia",
    name: "Ксения Петрова",
    rating: 5,
    image: imagePath("reviews/Ксения.png"),
    imageAlt: "",
    date: "6 апр. 2026",
  },
  {
    kind: "photo",
    id: "maxim",
    name: "Максим Орлов",
    text: "Много естественного света, стильный интерьер и достаточно места для команды.",
    rating: 5,
    avatar: imagePath("reviews/Максим.png"),
    tone: "dark",
    image: studio("фотостудия.png"),
    imageAlt: "Интерьер фотостудии",
    date: "18 янв. 2026",
  },
  {
    kind: "audio",
    id: "sofia",
    name: "София Белова",
    rating: 5,
    avatar: imagePath("reviews/София.png"),
    date: "9 сент. 2025",
  },
  {
    kind: "video",
    id: "darya",
    name: "Дарья Новикова",
    text: "Искали студию для съёмки команды и остались очень довольны. Красивое пространство, приятный свет и много возможностей для разных кадров. Фотографии получились живыми, не слишком постановочными — именно то, что нам было нужно.",
    rating: 5,
    avatar: imagePath("reviews/Дарья.png"),
    tone: "light",
    image: studio("Аренда студии.jpg"),
    imageAlt: "Пространство фотостудии",
    date: "22 нояб. 2025",
  },
  {
    kind: "photo",
    id: "artem",
    name: "Артём Ковалёв",
    text: "Удобно, что в одном пространстве можно сделать кадры с совершенно разным настроением.",
    rating: 5,
    avatar: imagePath("reviews/Артём.png"),
    tone: "dark",
    image: studio("Фотозона2.jpg"),
    imageAlt: "Фотозона студии",
    date: "14 февр. 2026",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="reviews__stars" aria-label={`${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`reviews__star${i < rating ? " is-on" : ""}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewDate({ date }: { date: string }) {
  return <time className="reviews__date">{date}</time>;
}

function Person({ name, avatar }: { name: string; avatar: string }) {
  return (
    <header className="reviews__person">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatar}
        alt=""
        className="reviews__avatar"
        width={64}
        height={64}
        decoding="async"
      />
      <h3 className="reviews__name">{name}</h3>
    </header>
  );
}

function Still({
  src,
  alt,
  onOpen,
}: {
  src: string;
  alt: string;
  onOpen: () => void;
}) {
  return (
    <figure className="reviews__still">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="reviews__photo-image"
        width={1200}
        height={720}
        decoding="async"
      />
      <button
        type="button"
        className="reviews__photo-open"
        onClick={onOpen}
        aria-label={alt ? `Открыть фотографию: ${alt}` : "Открыть фотографию"}
      />
    </figure>
  );
}
function TextReview({ card }: { card: TextCard }) {
  return (
    <article className={`reviews__card reviews__card--text reviews__card--${card.tone} span-3`}>
      <Person name={card.name} avatar={card.avatar} />
      <Stars rating={card.rating} />
      <p className="reviews__text">{card.text}</p>
      <ReviewDate date={card.date} />
    </article>
  );
}

function PhotoReview({
  card,
  onOpen,
}: {
  card: PhotoCard | VideoCard;
  onOpen: (shot: { src: string; alt: string }) => void;
}) {
  return (
    <article className={`reviews__card reviews__card--story reviews__card--${card.tone} span-3`}>
      <div className="reviews__card-copy">
        <Person name={card.name} avatar={card.avatar} />
        <Stars rating={card.rating} />
        <p className="reviews__text">{card.text}</p>
      </div>
      <Still
        src={card.image}
        alt={card.imageAlt}
        onOpen={() => onOpen({ src: card.image, alt: card.imageAlt })}
      />
      <ReviewDate date={card.date} />
    </article>
  );
}

function AudioPlaceholder({ card }: { card: AudioCard }) {
  return (
    <article className="reviews__card reviews__card--audio reviews__card--light span-3">
      <Person name={card.name} avatar={card.avatar} />
      <Stars rating={card.rating} />
      <div className="reviews__player">
        <span className="reviews__play" aria-hidden="true">
          <span className="reviews__play-icon" />
        </span>
        <span className="reviews__wave" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} />
          ))}
        </span>
      </div>
      <div className="reviews__track" aria-hidden="true">
        <span className="reviews__track-line" />
      </div>
      <ReviewDate date={card.date} />
    </article>
  );
}

function VideoPlaceholder({
  card,
  onOpen,
}: {
  card: VideoCard;
  onOpen: (shot: { src: string; alt: string }) => void;
}) {
  return <PhotoReview card={card} onOpen={onOpen} />;
}

function ClipReview({
  card,
  onOpen,
}: {
  card: ClipCard;
  onOpen: (shot: { src: string; alt: string }) => void;
}) {
  return (
    <article className="reviews__card reviews__card--clip span-3">
      <div className="reviews__clip">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt=""
          className="reviews__photo-image"
          width={1200}
          height={750}
          decoding="async"
        />
        <div className="reviews__clip-bar">
          <div className="reviews__clip-copy">
            <h3 className="reviews__name">{card.name}</h3>
            <Stars rating={card.rating} />
            <ReviewDate date={card.date} />
          </div>
          <span className="reviews__play" aria-hidden="true">
            <span className="reviews__play-icon" />
          </span>
        </div>
        <button
          type="button"
          className="reviews__photo-open"
          onClick={() => onOpen({ src: card.image, alt: card.name })}
          aria-label={`Открыть фотографию, ${card.name}`}
        />
      </div>
    </article>
  );
}

export default function Reviews() {
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>();
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const [lightboxItem, setLightboxItem] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const dialog = lightboxRef.current;
    if (!dialog) return;

    if (lightboxItem) {
      if (!dialog.open) dialog.showModal();
      const previousOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = previousOverflow;
      };
    }

    if (dialog.open) dialog.close();
  }, [lightboxItem]);

  const openLightbox = (shot: { src: string; alt: string }) => {
    setLightboxItem(shot);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mobileQuery = window.matchMedia("(max-width: 700px)");
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | null = null;

    const cards = () => [...root.querySelectorAll<HTMLElement>(".reviews__card")];

    const show = (card: HTMLElement) => {
      card.classList.add("is-shown");
    };

    const connect = () => {
      observer?.disconnect();
      observer = null;
      const items = cards();

      if (!mobileQuery.matches || reduceQuery.matches) {
        items.forEach(show);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );

      items.forEach((card) => {
        if (!card.classList.contains("is-shown")) observer?.observe(card);
      });
    };

    connect();
    mobileQuery.addEventListener("change", connect);
    reduceQuery.addEventListener("change", connect);

    return () => {
      observer?.disconnect();
      mobileQuery.removeEventListener("change", connect);
      reduceQuery.removeEventListener("change", connect);
    };
  }, [sectionRef]);

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className={`reviews${revealed ? " is-revealed" : ""}`}
      aria-labelledby="reviews-heading"
    >
      <div className="reviews__inner site-grid">
        <header className="reviews__header reviews-reveal span-12">
          <h2 id="reviews-heading" className="reviews__heading">
            Отзывы
          </h2>
        </header>

        <div
          className="reviews__mosaic reviews-reveal span-12"
          style={{ ["--reviews-delay" as string]: "120ms" }}
        >
          <div className="reviews__stack">
            {CARDS.filter((card) => card.id === "alina" || card.id === "ksenia").map((card) => {
              if (card.kind === "text") return <TextReview key={card.id} card={card} />;
              if (card.kind === "clip") return <ClipReview key={card.id} card={card} onOpen={openLightbox} />;
              return null;
            })}
          </div>
          {CARDS.filter((card) => card.id !== "alina" && card.id !== "ksenia").map((card) => {
            if (card.kind === "text") return <TextReview key={card.id} card={card} />;
            if (card.kind === "photo") return <PhotoReview key={card.id} card={card} onOpen={openLightbox} />;
            if (card.kind === "audio") return <AudioPlaceholder key={card.id} card={card} />;
            if (card.kind === "clip") return <ClipReview key={card.id} card={card} onOpen={openLightbox} />;
            return <VideoPlaceholder key={card.id} card={card} onOpen={openLightbox} />;
          })}
        </div>
      </div>

      <dialog
        ref={lightboxRef}
        className="gallery-lightbox"
        aria-label={lightboxItem ? lightboxItem.alt : "Просмотр фотографии"}
        onClose={closeLightbox}
        onClick={(event) => {
          if (event.target === lightboxRef.current) closeLightbox();
        }}
      >
        {lightboxItem ? (
          <>
            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeLightbox}
              aria-label="Закрыть"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="gallery-lightbox__image"
              width={1600}
              height={1000}
              decoding="async"
            />
          </>
        ) : null}
      </dialog>
    </section>
  );
}
