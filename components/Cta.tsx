"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

const MOSCOW_WEEKDAY: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** Nearest Sunday 23:59:59 in Europe/Moscow, as UTC ms. Fixed once; does not roll to next week. */
function getNearestSundayDeadlineMoscowMs(fromMs: number): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Moscow",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    dtf
      .formatToParts(new Date(fromMs))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const dow = MOSCOW_WEEKDAY[parts.weekday] ?? 0;
  const daysUntilSunday = (7 - dow) % 7;

  const deadlineLocal = new Date(Date.UTC(year, month - 1, day + daysUntilSunday));
  const y = deadlineLocal.getUTCFullYear();
  const m = String(deadlineLocal.getUTCMonth() + 1).padStart(2, "0");
  const d = String(deadlineLocal.getUTCDate()).padStart(2, "0");

  /* Moscow has no DST — fixed offset +03:00 */
  return new Date(`${y}-${m}-${d}T23:59:59+03:00`).getTime();
}

function getTimeLeft(deadlineMs: number, nowMs: number): TimeLeft {
  const diff = deadlineMs - nowMs;
  if (diff <= 0) return ZERO;

  const totalSec = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export default function Cta() {
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>({
    threshold: 0.18,
    rootMargin: "0px 0px -6% 0px",
    visibleTopRatio: 0.85,
  });
  const deadlineRef = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(ZERO);

  useEffect(() => {
    const deadlineMs = getNearestSundayDeadlineMoscowMs(Date.now());
    deadlineRef.current = deadlineMs;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline == null) return;
      setTimeLeft(getTimeLeft(deadline, Date.now()));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`cta${revealed ? " is-revealed" : ""}`}
      aria-label="Акция на первое бронирование"
    >
      <div className="cta__grid">
        <div className="cta__copy">
          <div className="cta-reveal cta-reveal--copy">
            <h2 className="cta__heading">
              <span className="cta__heading-line">Твой первый кадр —</span>
              <span className="cta__heading-line">со скидкой</span>
            </h2>
            <p className="cta__text">
              Забронируй студию впервые и получи скидку 15% на аренду.
            </p>
          </div>

          <div className="cta-reveal cta-reveal--timer">
            <div className="cta__rule" aria-hidden="true" />
            <div
              className="cta__timer"
              role="timer"
              aria-live="polite"
              aria-atomic="true"
            >
              {(
                [
                  ["days", "Дни", timeLeft.days],
                  ["hours", "Часы", timeLeft.hours],
                  ["minutes", "Минуты", timeLeft.minutes],
                  ["seconds", "Секунды", timeLeft.seconds],
                ] as const
              ).map(([key, label, value]) => (
                <div key={key} className="cta__timer-cell">
                  <span className="cta__timer-value">{pad2(value)}</span>
                  <span className="cta__timer-unit">{label}</span>
                </div>
              ))}
            </div>
            <div className="cta__rule" aria-hidden="true" />
          </div>

          <a href="#services" className="cta__button cta-reveal cta-reveal--button">
            Забронировать студию
            <span className="cta__button-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <div className="cta__media cta-reveal cta-reveal--media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${encodeURIComponent("ста.png")}`}
            alt="Интерьер фотостудии PHOTO DREAM — окно и красный свет"
            className="cta__image"
            width={1200}
            height={1600}
          />
        </div>
      </div>
    </section>
  );
}
