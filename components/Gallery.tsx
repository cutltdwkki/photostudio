"use client";

import { useEffect, useRef, useState } from "react";

type TileSize = "md" | "tall" | "snug";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Vertical tile proportion — all tiles stay portrait. */
  size: TileSize;
  /** Crop focus for object-fit: cover */
  objectPosition?: string;
};

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

/** All suitable studio photos in the project (excludes icons/SVGs). */
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "hero",
    src: imagePath("hero.png"),
    alt: "Интерьер фотостудии PHOTO DREAM — широкий план пространства",
    width: 1672,
    height: 940,
    size: "md",
    objectPosition: "52% 42%",
  },
  {
    id: "photographer",
    src: imagePath("Студия с фотографом.png"),
    alt: "Съёмка в студии с фотографом",
    width: 1024,
    height: 1536,
    size: "tall",
    objectPosition: "50% 28%",
  },
  {
    id: "story-space",
    src: "/images/stories/story-space.jpg",
    alt: "Циклорама и направленный свет в студии",
    width: 864,
    height: 1152,
    size: "md",
    objectPosition: "50% 40%",
  },
  {
    id: "zone",
    src: imagePath("Фотозона2.jpg"),
    alt: "Готовая фотозона — интерьер для съёмки",
    width: 1506,
    height: 1042,
    size: "snug",
    objectPosition: "48% 45%",
  },
  {
    id: "cta",
    src: "/images/cta.png",
    alt: "Кинематографичный кадр интерьера студии",
    width: 864,
    height: 1152,
    size: "tall",
    objectPosition: "55% 35%",
  },
  {
    id: "story-inspiration",
    src: "/images/stories/story-inspiration.jpg",
    alt: "Портрет в кинематографичном свете",
    width: 864,
    height: 1152,
    size: "md",
    objectPosition: "50% 22%",
  },
  {
    id: "photostudio",
    src: imagePath("фотостудия.png"),
    alt: "Пространство студии — общий план интерьера",
    width: 1672,
    height: 941,
    size: "md",
    objectPosition: "50% 40%",
  },
  {
    id: "sta",
    src: imagePath("ста.png"),
    alt: "Окно и красный свет в интерьере студии",
    width: 1086,
    height: 1448,
    size: "tall",
    objectPosition: "62% 38%",
  },
  {
    id: "story-behind",
    src: "/images/stories/story-behind-scenes.jpg",
    alt: "Процесс съёмки за кадром",
    width: 864,
    height: 1152,
    size: "snug",
    objectPosition: "45% 30%",
  },
  {
    id: "rent",
    src: imagePath("Аренда студии.jpg"),
    alt: "Аренда студии — свободное пространство",
    width: 759,
    height: 1024,
    size: "md",
    objectPosition: "50% 45%",
  },
  {
    id: "story-equipment",
    src: "/images/stories/story-equipment.jpg",
    alt: "Световое оборудование и камера в студии",
    width: 864,
    height: 1152,
    size: "tall",
    objectPosition: "50% 35%",
  },
  {
    id: "story-ideas",
    src: "/images/stories/story-ideas.jpg",
    alt: "Подготовка декораций и реквизита",
    width: 864,
    height: 1152,
    size: "snug",
    objectPosition: "50% 40%",
  },
  {
    id: "story-tips",
    src: "/images/stories/story-tips.jpg",
    alt: "Настройка студийного света перед съёмкой",
    width: 864,
    height: 1152,
    size: "md",
    objectPosition: "48% 32%",
  },
];

const INITIAL_COUNT = 8;
const BATCH_COUNT = 5;

/* Cache-bust when the background asset is replaced in place */
const GALLERY_BG_SRC = `${imagePath("фон галерея.png")}?v=233321`;

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgScaleRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDialogElement>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [revealed, setRevealed] = useState(false);
  const [enteringIds, setEnteringIds] = useState<Set<string>>(() => new Set());
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const visibleItems = GALLERY_ITEMS.slice(0, visibleCount);
  const hasMore = visibleCount < GALLERY_ITEMS.length;

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

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

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

  useEffect(() => {
    const section = sectionRef.current;
    const scaleNode = bgScaleRef.current;
    if (!section || !scaleNode) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      /* 0 when section enters bottom of viewport → 1 as it leaves the top */
      const start = viewH;
      const end = -rect.height;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      /* Subtle zoom: 1 → 1.12 */
      const scale = 1 + progress * 0.12;
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

  const showMore = () => {
    const nextCount = Math.min(visibleCount + BATCH_COUNT, GALLERY_ITEMS.length);
    const newlyShown = GALLERY_ITEMS.slice(visibleCount, nextCount).map((item) => item.id);
    setEnteringIds(new Set(newlyShown));
    setVisibleCount(nextCount);

    window.requestAnimationFrame(() => {
      window.setTimeout(() => setEnteringIds(new Set()), 700);
    });
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`gallery${revealed ? " is-revealed" : ""}`}
      aria-label="Галерея"
    >
      <div className="gallery__bg" aria-hidden="true">
        <div className="gallery__bg-scale" ref={bgScaleRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GALLERY_BG_SRC}
            alt=""
            className="gallery__bg-image"
            width={1086}
            height={1448}
            decoding="async"
          />
        </div>
        <div className="gallery__bg-veil" />
      </div>

      <div className="gallery__inner">
        <header className="gallery__header gallery-reveal">
          <h2 className="gallery__heading">Галерея</h2>
          <p className="gallery__eyebrow">Кадры из студии</p>
        </header>

        <div className="gallery__masonry" role="list">
          {visibleItems.map((item, index) => {
            const isEntering = enteringIds.has(item.id);
            const isInitial = index < INITIAL_COUNT;
            return (
              <figure
                key={item.id}
                className={`gallery__item gallery__item--${item.size}${isInitial ? " gallery-reveal" : ""}${isEntering ? " is-entering" : ""}`}
                style={
                  isInitial
                    ? { ["--gallery-delay" as string]: `${Math.min(index, 11) * 40}ms` }
                    : undefined
                }
                role="listitem"
              >
                <button
                  type="button"
                  className="gallery__trigger"
                  onClick={() => openLightbox(item)}
                  aria-label={`Открыть фото: ${item.alt}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt=""
                    className="gallery__image"
                    width={item.width}
                    height={item.height}
                    style={{
                      objectPosition: item.objectPosition ?? "50% 40%",
                    }}
                    loading={index < INITIAL_COUNT ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span className="gallery__shade" aria-hidden="true" />
                </button>
              </figure>
            );
          })}
        </div>

        {hasMore ? (
          <div className="gallery__actions gallery-reveal">
            <button type="button" className="gallery__more" onClick={showMore}>
              Показать ещё
            </button>
          </div>
        ) : null}
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
