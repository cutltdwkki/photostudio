"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

type RowDirection = "left" | "right";

type GalleryRow = {
  id: string;
  direction: RowDirection;
  duration: string;
  photos: Photo[];
};

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

/**
 * Studio, interior, shooting and equipment frames found in the project.
 * Excludes review portraits and the decorative gallery background.
 */
const PHOTOS: Photo[] = [
  {
    id: "hero",
    src: imagePath("hero.png"),
    alt: "Интерьер фотостудии PHOTO DREAM — широкий план пространства",
    width: 1672,
    height: 940,
  },
  {
    id: "photographer",
    src: imagePath("Студия с фотографом.png"),
    alt: "Съёмка в студии с фотографом",
    width: 1024,
    height: 1536,
  },
  {
    id: "space",
    src: "/images/stories/story-space.jpg",
    alt: "Циклорама и направленный свет в студии",
    width: 864,
    height: 1152,
  },
  {
    id: "inspiration",
    src: "/images/stories/story-inspiration.jpg",
    alt: "Портрет в кинематографичном свете",
    width: 864,
    height: 1152,
  },
  {
    id: "behind",
    src: "/images/stories/story-behind-scenes.jpg",
    alt: "Процесс съёмки за кадром",
    width: 864,
    height: 1152,
  },
  {
    id: "photostudio",
    src: imagePath("фотостудия.png"),
    alt: "Пространство студии — общий план интерьера",
    width: 1672,
    height: 941,
  },
  {
    id: "cta",
    src: "/images/cta.png",
    alt: "Кинематографичный кадр интерьера студии",
    width: 864,
    height: 1152,
  },
  {
    id: "equipment",
    src: "/images/stories/story-equipment.jpg",
    alt: "Световое оборудование и камера в студии",
    width: 864,
    height: 1152,
  },
  {
    id: "ideas",
    src: "/images/stories/story-ideas.jpg",
    alt: "Подготовка декораций и реквизита",
    width: 864,
    height: 1152,
  },
  {
    id: "tips",
    src: "/images/stories/story-tips.jpg",
    alt: "Настройка студийного света перед съёмкой",
    width: 864,
    height: 1152,
  },
  {
    id: "zone",
    src: imagePath("Фотозона2.jpg"),
    alt: "Готовая фотозона — интерьер для съёмки",
    width: 1506,
    height: 1042,
  },
  {
    id: "sta",
    src: imagePath("ста.png"),
    alt: "Окно и красный свет в интерьере студии",
    width: 1086,
    height: 1448,
  },
  {
    id: "rent",
    src: imagePath("Аренда студии.jpg"),
    alt: "Аренда студии — свободное пространство",
    width: 759,
    height: 1024,
  },
  {
    id: "faq-wide",
    src: imagePath("big.png"),
    alt: "Зал студии с циклорамой и красным светом",
    width: 928,
    height: 1152,
  },
  {
    id: "faq-chair",
    src: imagePath("small.png"),
    alt: "Кресло и свет в интерьере студии",
    width: 928,
    height: 1152,
  },
];

const photo = (id: string) => PHOTOS.find((item) => item.id === id)!;

function FilmRow({
  row,
  onOpen,
}: {
  row: GalleryRow;
  onOpen: (item: Photo) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(1);

  useLayoutEffect(() => {
    const rowEl = rowRef.current;
    if (!rowEl) return;

    const measure = () => {
      const sequences = [...rowEl.querySelectorAll<HTMLElement>(".gallery__seq")];
      const unit = sequences[0];
      if (!unit) return;
      const shots = [...unit.querySelectorAll<HTMLElement>(".gallery__shot")];
      if (shots.length === 0) return;

      const view = rowEl.clientWidth;
      const height = rowEl.clientHeight;
      if (view < 1 || height < 1) return;

      const ratios = shots.map((shot) => {
        const raw = getComputedStyle(shot).aspectRatio;
        if (raw.includes("/")) {
          const [w, h] = raw.split("/").map(Number);
          return h > 0 ? w / h : 1;
        }
        const ratio = Number(raw);
        return Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
      });
      const widths = ratios.map((ratio) => height * (ratio > 1 ? ratio * 0.75 : ratio));

      sequences.forEach((sequence) => {
        const frames = sequence.querySelectorAll<HTMLElement>(".gallery__shot");
        frames.forEach((frame, index) => {
          const width = widths[index];
          if (width) frame.style.width = `${width}px`;
        });
      });

      const one = unit.getBoundingClientRect().width;
      if (one < 1) return;
      const needed = Math.max(1, Math.ceil(view / one));
      setCopies((current) => (current === needed ? current : needed));
    };

    measure();
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(rowEl);

    return () => {
      observer.disconnect();
    };
  }, [copies]);

  const renderSequence = (copy: number, unit: boolean) => (
    <ul
      key={copy}
      className="gallery__seq"
      data-gallery-unit={unit ? "" : undefined}
      aria-hidden={copy === 0 ? undefined : true}
    >
      {row.photos.map((item) => (
        <li key={`${item.id}-${copy}`} className="gallery__item">
          <button
            type="button"
            className="gallery__shot"
            style={{ "--shot-ratio": `${item.width} / ${item.height}` } as CSSProperties}
            onClick={() => onOpen(item)}
            aria-label={copy === 0 ? `Открыть фото: ${item.alt}` : undefined}
            tabIndex={copy === 0 ? undefined : -1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt=""
              className="gallery__image"
              width={item.width}
              height={item.height}
              draggable={false}
              decoding="async"
            />
            <span className="gallery__shade" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={rowRef}
      className={`gallery__row gallery__row--${row.direction}`}
      style={
        {
          "--gallery-duration": row.duration,
          "--gallery-copies": copies,
        } as CSSProperties
      }
    >
      <div className="gallery__track">
        {[0, 1].map((half) => (
          <div
            key={half}
            className="gallery__half"
            aria-hidden={half === 1 ? true : undefined}
          >
            {Array.from({ length: copies }, (_, copy) =>
              renderSequence(half * copies + copy, half === 0 && copy === 0),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const ROWS: GalleryRow[] = [
  {
    id: "to-left",
    direction: "left",
    duration: "40s",
    photos: ["hero", "photographer", "space", "inspiration", "behind"].map(photo),
  },
  {
    id: "to-right",
    direction: "right",
    duration: "50s",
    photos: ["photostudio", "cta", "equipment", "ideas", "tips"].map(photo),
  },
  {
    id: "to-left-slow",
    direction: "left",
    duration: "36s",
    photos: ["zone", "sta", "rent", "faq-wide", "faq-chair"].map(photo),
  },
];

export default function Gallery() {
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>({
    threshold: 0.16,
  });
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const [lightboxItem, setLightboxItem] = useState<Photo | null>(null);

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

  const openLightbox = (item: Photo) => {
    setLightboxItem(item);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`gallery${revealed ? " is-revealed" : ""}`}
      aria-labelledby="gallery-heading"
    >
      <div className="gallery__bg" aria-hidden="true" />
      <header className="gallery__header gallery-reveal">
        <h2 id="gallery-heading" className="gallery__heading">
          Галерея
        </h2>
      </header>

      <div className="gallery__rows">
        {ROWS.map((row) => (
          <FilmRow key={row.id} row={row} onOpen={openLightbox} />
        ))}
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
              width={lightboxItem.width}
              height={lightboxItem.height}
              decoding="async"
            />
          </>
        ) : null}
      </dialog>
    </section>
  );
}
