"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type StudioSlide = {
  src: string;
  alt: string;
};

type StudioSliderProps = {
  slides: StudioSlide[];
};

export default function StudioSlider({ slides }: StudioSliderProps) {
  const [index, setIndex] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const pointerDeltaX = useRef(0);
  const isDragging = useRef(false);

  const count = slides.length;
  const safeIndex = count === 0 ? 0 : ((index % count) + count) % count;

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const slide = viewport?.querySelector<HTMLElement>(".studio-slider__slide");
    if (!viewport || !slide) return;
    const styles = getComputedStyle(trackRef.current ?? slide);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    setSlideStep(slide.getBoundingClientRect().width + gap);
  }, []);

  useLayoutEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [measure, count]);

  const baseOffset = () => {
    if (!slideStep) return 0;
    const viewportWidth = viewportRef.current?.clientWidth ?? 0;
    /* Center active slide: side peeks show ~half of neighbors */
    return viewportWidth / 2 - slideStep / 2 - safeIndex * slideStep;
  };

  const applyTransform = (offset: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  useLayoutEffect(() => {
    if (isDragging.current) return;
    applyTransform(baseOffset(), true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, slideStep]);

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);
  const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    isDragging.current = true;
    pointerStartX.current = event.clientX;
    pointerDeltaX.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || pointerStartX.current === null) return;
    pointerDeltaX.current = event.clientX - pointerStartX.current;
    applyTransform(baseOffset() + pointerDeltaX.current, false);
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = pointerDeltaX.current;
    pointerStartX.current = null;
    pointerDeltaX.current = 0;

    const threshold = Math.max(48, slideStep * 0.12);
    if (Math.abs(delta) > threshold) {
      if (delta < 0) goNext();
      else goPrev();
    } else {
      applyTransform(baseOffset(), true);
    }
  };

  if (count === 0) {
    return (
      <div className="studio-slider studio-slider--empty" role="status">
        <p className="studio-slider__empty">
          Добавьте фотографии студии в <code>/public/images/</code>
        </p>
      </div>
    );
  }

  const label = `${String(safeIndex + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return (
    <div
      className="studio-slider"
      aria-roledescription="carousel"
      aria-label="Фотографии студии"
    >
      <div
        ref={viewportRef}
        className="studio-slider__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="studio-slider__track">
          {slides.map((slide, i) => (
            <figure
              key={`${slide.src}-${i}`}
              className={`studio-slider__slide${i === safeIndex ? " is-active" : ""}`}
              aria-hidden={i !== safeIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                className="studio-slider__image"
                draggable={false}
              />
            </figure>
          ))}
        </div>
      </div>

      <div className="studio-slider__controls">
        <button
          type="button"
          className="studio-slider__arrow"
          onClick={goPrev}
          aria-label="Предыдущий слайд"
          disabled={count < 2}
        >
          <span aria-hidden="true">←</span>
        </button>

        <p className="studio-slider__counter" aria-live="polite">
          {label}
        </p>

        <button
          type="button"
          className="studio-slider__arrow"
          onClick={goNext}
          aria-label="Следующий слайд"
          disabled={count < 2}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="studio-slider__dots" role="tablist" aria-label="Слайды">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === safeIndex}
            aria-label={`Слайд ${i + 1}`}
            className={`studio-slider__dot${i === safeIndex ? " is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
