"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

type Story = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  isNew?: boolean;
};

const STORIES: Story[] = [
  {
    id: "space",
    title: "Место, где идеи становятся кадрами",
    description:
      "Свет, фон и немного смелости — всё остальное зависит от твоей фантазии.",
    image: "/images/stories/story-space.jpg",
    imageAlt: "Интерьер фотостудии с циклорамой и направленным светом",
    isNew: true,
  },
  {
    id: "behind",
    title: "Как проходит съёмка в PHOTO DREAM",
    description:
      "От первых настроек света до последнего кадра — пространство для твоего творческого процесса.",
    image: "/images/stories/story-behind-scenes.jpg",
    imageAlt: "Фотограф снимает модель в студии",
    isNew: true,
  },
  {
    id: "inspiration",
    title: "Необычный свет. Твой собственный стиль.",
    description:
      "Экспериментируй с образами, пробуй новые ракурсы и создавай фотографии, которые хочется пересматривать.",
    image: "/images/stories/story-inspiration.jpg",
    imageAlt: "Кинематографичный портрет модели",
  },
  {
    id: "tips",
    title: "Как подготовиться к съёмке и не потеряться",
    description:
      "Что взять с собой, как выбрать образы и использовать время в студии по максимуму.",
    image: "/images/stories/story-tips.jpg",
    imageAlt: "Фотограф настраивает студийный свет",
  },
  {
    id: "equipment",
    title: "Больше, чем просто фон",
    description:
      "Знакомься с пространством, световым оборудованием и возможностями студии перед бронированием.",
    image: "/images/stories/story-equipment.jpg",
    imageAlt: "Камера, штатив и световое оборудование в студии",
  },
  {
    id: "ideas",
    title: "Одна студия — десятки разных историй",
    description:
      "Портреты, контент для брендов, творческие проекты — вдохновение начинается с идеи.",
    image: "/images/stories/story-ideas.jpg",
    imageAlt: "Подготовка декораций и реквизита к съёмке",
  },
];

/* Smooth ease-in-out for rail motion */
const EASE = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Stories() {
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>({
    threshold: 0.22,
    rootMargin: "0px 0px -6% 0px",
    visibleTopRatio: 0.85,
  });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const scrollAnimRef = useRef(0);

  const updateNav = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  const animateScrollLeft = useCallback(
    (el: HTMLElement, to: number, duration = 760) => {
      const from = el.scrollLeft;
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      const target = Math.min(max, Math.max(0, to));
      const delta = target - from;
      if (Math.abs(delta) < 1) {
        updateNav();
        return;
      }

      cancelAnimationFrame(scrollAnimRef.current);
      el.classList.add("is-scrolling");
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        el.scrollLeft = from + delta * EASE(t);
        if (t < 1) {
          scrollAnimRef.current = requestAnimationFrame(tick);
        } else {
          el.classList.remove("is-scrolling");
          updateNav();
        }
      };

      scrollAnimRef.current = requestAnimationFrame(tick);
    },
    [updateNav],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    updateNav();
    el.addEventListener("scroll", updateNav, { passive: true });
    const ro = new ResizeObserver(() => updateNav());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateNav);
      ro.disconnect();
      cancelAnimationFrame(scrollAnimRef.current);
    };
  }, [updateNav]);

  const getCardStep = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return 0;
    const card = el.querySelector<HTMLElement>(".stories__card");
    const styles = getComputedStyle(el.querySelector(".stories__track") ?? el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "12") || 12;
    return (card?.getBoundingClientRect().width ?? el.clientWidth * 0.22) + gap;
  }, []);

  const scrollByCard = (dir: -1 | 1) => {
    const el = viewportRef.current;
    if (!el) return;
    const step = getCardStep();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.scrollBy({ left: dir * step });
      updateNav();
      return;
    }
    animateScrollLeft(el, el.scrollLeft + dir * step, 760);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const el = viewportRef.current;
    if (!el) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
    el.classList.add("is-dragging");
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = viewportRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    if (Math.abs(dx) > 3) drag.moved = true;
    el.scrollLeft = drag.startScroll - dx;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = viewportRef.current;
    if (!drag || !el || drag.pointerId !== event.pointerId) return;
    const moved = drag.moved;
    dragRef.current = null;
    el.classList.remove("is-dragging");
    try {
      el.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }

    if (!moved) {
      updateNav();
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = getCardStep();
    if (reduce || step < 1) {
      updateNav();
      return;
    }

    const index = Math.round(el.scrollLeft / step);
    animateScrollLeft(el, index * step, 520);
  };

  return (
    <section
      ref={sectionRef}
      id="stories"
      className={`stories site-section${revealed ? " is-revealed" : ""}`}
      aria-labelledby="stories-heading"
    >
      <div className="stories__inner">
        <div className="stories__toolbar stories-reveal stories-reveal--toolbar">
          <h2 id="stories-heading" className="stories__heading">
            Истории
          </h2>
          <div className="stories__nav" role="group" aria-label="Навигация по историям">
            <button
              type="button"
              className="stories__nav-btn"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
            >
              <span className="stories__nav-arrow" aria-hidden="true">
                ←
              </span>
              Назад
            </button>
            <button
              type="button"
              className="stories__nav-btn stories__nav-btn--next"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
            >
              Вперёд
              <span className="stories__nav-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="stories__rail">
        <div
          ref={viewportRef}
          className="stories__viewport"
          tabIndex={0}
          aria-label="Лента историй"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <ul className="stories__track">
            {STORIES.map((story, index) => (
              <li
                key={story.id}
                className="stories__card stories-reveal stories-reveal--card"
                style={{ ["--stories-stagger" as string]: `${index * 120}ms` }}
              >
                <article className="stories__card-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={story.imageAlt}
                    className="stories__image"
                    width={360}
                    height={500}
                    draggable={false}
                  />
                  <div className="stories__shade" aria-hidden="true" />
                  {story.isNew ? (
                    <span className="stories__badge">New</span>
                  ) : null}
                  <div className="stories__card-copy">
                    <div className="stories__card-title-row">
                      <h3 className="stories__card-title">{story.title}</h3>
                      <span className="stories__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
