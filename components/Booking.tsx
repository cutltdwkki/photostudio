"use client";

import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useEffectEvent,
} from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type BurstPhoto = {
  id: string;
  src: string;
  alt: string;
  /** Final offset from center — use vw/vh (not %), % is relative to the photo itself */
  x: string;
  y: string;
  scale: number;
  width: number;
  z: number;
};

type FormState = {
  name: string;
  phone: string;
  comment: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

/** Studio / space photos only — excludes reviews portraits. */
const BURST_PHOTOS: BurstPhoto[] = [
  {
    id: "space",
    src: "/images/stories/story-space.jpg",
    alt: "Циклорама и свет в студии",
    x: "-34vw",
    y: "-20vh",
    scale: 1.05,
    width: 220,
    z: 2,
  },
  {
    id: "rent",
    src: imagePath("Аренда студии.jpg"),
    alt: "Свободное пространство для съёмки",
    x: "34vw",
    y: "-16vh",
    scale: 1.12,
    width: 200,
    z: 3,
  },
  {
    id: "zone",
    src: imagePath("Фотозона2.jpg"),
    alt: "Готовая фотозона",
    x: "-36vw",
    y: "14vh",
    scale: 0.95,
    width: 190,
    z: 2,
  },
  {
    id: "equipment",
    src: "/images/stories/story-equipment.jpg",
    alt: "Студийное оборудование",
    x: "36vw",
    y: "18vh",
    scale: 1,
    width: 180,
    z: 3,
  },
  {
    id: "sta",
    src: imagePath("ста.png"),
    alt: "Окно и красный свет в интерьере",
    x: "-12vw",
    y: "-28vh",
    scale: 1.18,
    width: 240,
    z: 4,
  },
  {
    id: "photographer",
    src: imagePath("Студия с фотографом.png"),
    alt: "Съёмка в студии",
    x: "18vw",
    y: "-26vh",
    scale: 1.08,
    width: 170,
    z: 3,
  },
  {
    id: "behind",
    src: "/images/stories/story-behind-scenes.jpg",
    alt: "Процесс съёмки за кадром",
    x: "-22vw",
    y: "28vh",
    scale: 0.9,
    width: 160,
    z: 1,
  },
  {
    id: "tips",
    src: "/images/stories/story-tips.jpg",
    alt: "Настройка студийного света",
    x: "24vw",
    y: "30vh",
    scale: 0.92,
    width: 165,
    z: 1,
  },
];

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** Formats as +7 (___) ___-__-__ while typing. */
function formatPhoneInput(raw: string) {
  let digits = digitsOnly(raw);
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits && !digits.startsWith("7")) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  let out = "+7";
  if (rest.length === 0) return out;
  out += ` (${rest.slice(0, 3)}`;
  if (rest.length < 3) return out;
  out += ")";
  if (rest.length === 3) return `${out} `;
  out += ` ${rest.slice(3, 6)}`;
  if (rest.length <= 6) return out;
  out += `-${rest.slice(6, 8)}`;
  if (rest.length <= 8) return out;
  out += `-${rest.slice(8, 10)}`;
  return out;
}

function isValidPhone(value: string) {
  const digits = digitsOnly(value);
  return digits.length === 11 && digits.startsWith("7");
}

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) {
    errors.name = "Укажи имя";
  } else if (form.name.trim().length < 2) {
    errors.name = "Имя слишком короткое";
  }
  if (!form.phone.trim()) {
    errors.phone = "Укажи телефон";
  } else if (!isValidPhone(form.phone)) {
    errors.phone = "Введи номер в формате +7 (___) ___-__-__";
  }
  return errors;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [progress, setProgress] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    comment: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const updateProgress = useEffectEvent(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    /* Longer scroll travel = slower burst; no sticky runway / scroll lock */
    const start = viewH * 0.95;
    const end = -viewH * 0.55;
    const raw = (start - rect.top) / Math.max(start - end, 1);
    setProgress(easeOutCubic(clamp01(raw)));
  });

  useEffect(() => {
    if (reduceMotion) {
      queueMicrotask(() => setProgress(1));
      return;
    }

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => updateProgress());
    };

    frame = requestAnimationFrame(() => updateProgress());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduceMotion]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("photodream-booking");
      if (!raw) return;
      const data = JSON.parse(raw) as {
        title?: string;
        date?: string | null;
        priceLabel?: string;
      };
      const parts = [
        data.title ? `Услуга: ${data.title}` : null,
        data.date ? `Дата: ${data.date}` : null,
        data.priceLabel ? `Тариф: ${data.priceLabel}` : null,
      ].filter(Boolean);
      if (parts.length === 0) return;
      queueMicrotask(() => {
        setForm((prev) =>
          prev.comment.trim()
            ? prev
            : { ...prev, comment: parts.join(". ") },
        );
      });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--booking-p", String(progress));
  }, [progress]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      setStatusMessage("");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: digitsOnly(form.phone),
          comment: form.comment.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setStatus("error");
        setStatusMessage(
          payload?.error ??
            "Не удалось отправить заявку. Попробуй ещё раз чуть позже.",
        );
        return;
      }

      setStatus("success");
      setStatusMessage("СПАСИБО! ТВОЯ ЗАЯВКА ОТПРАВЛЕНА.");
      setForm({ name: "", phone: "", comment: "" });
      setErrors({});
      try {
        sessionStorage.removeItem("photodream-booking");
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
      setStatusMessage(
        "Не удалось отправить заявку. Проверь соединение и попробуй снова.",
      );
    }
  };

  return (
    <section
      id="booking"
      ref={sectionRef}
      className={`booking${reduceMotion ? " is-reduced" : ""}`}
      aria-label="Заявка на аренду студии"
      style={{ ["--booking-p" as string]: String(progress) }}
    >
      <div className="booking__pin">
        <div className="booking__stage" ref={stageRef}>
          <div className="booking__photos" aria-hidden="true">
            {BURST_PHOTOS.map((photo) => (
              <figure
                key={photo.id}
                className="booking__photo"
                style={{
                  ["--photo-x" as string]: photo.x,
                  ["--photo-y" as string]: photo.y,
                  ["--photo-scale" as string]: String(photo.scale),
                  ["--photo-w" as string]: `${photo.width}px`,
                  zIndex: photo.z,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt=""
                  width={photo.width}
                  height={Math.round(photo.width * 1.25)}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>

          <div className="booking__veil" aria-hidden="true" />

          <div className="booking__inner">
            <div className="booking__copy">
              <h2 className="booking__heading">
                <span className="booking__heading-line">Твоя идея.</span>
                <span className="booking__heading-line">Наше пространство.</span>
              </h2>
              <p className="booking__lead">
                У каждой съёмки есть своя история. Найди пространство для
                своей — экспериментируй со светом, создавай новые образы и
                воплощай идеи, которые давно хотелось попробовать.
              </p>
              <p className="booking__accent">Твоя съёмка начинается здесь.</p>
            </div>

            <div className="booking__form-wrap">
              {status === "success" ? (
                <div className="booking__success" role="status" aria-live="polite">
                  <p className="booking__success-title">{statusMessage}</p>
                  <button
                    type="button"
                    className="booking__submit"
                    onClick={() => {
                      setStatus("idle");
                      setStatusMessage("");
                    }}
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form className="booking__form" onSubmit={onSubmit} noValidate>
                  <header className="booking__form-header">
                    <h3 className="booking__form-title">
                      Давайте обсудим твою съёмку
                    </h3>
                    <p className="booking__form-subtitle">
                      Оставь контакты — мы свяжемся с тобой и поможем с
                      организацией съёмки.
                    </p>
                  </header>

                  <div className="booking__field">
                    <label className="booking__label" htmlFor="booking-name">
                      Имя
                      <span className="booking__required" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="booking-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      className={`booking__input${errors.name ? " is-invalid" : ""}`}
                      placeholder="Как к тебе обращаться?"
                      value={form.name}
                      disabled={status === "loading"}
                      onChange={(event) => {
                        setForm((prev) => ({ ...prev, name: event.target.value }));
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "booking-name-error" : undefined}
                    />
                    {errors.name ? (
                      <p id="booking-name-error" className="booking__error" role="alert">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="booking__field">
                    <label className="booking__label" htmlFor="booking-phone">
                      Телефон
                      <span className="booking__required" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className={`booking__input${errors.phone ? " is-invalid" : ""}`}
                      placeholder="+7 (___) ___-__-__"
                      value={form.phone}
                      disabled={status === "loading"}
                      onChange={(event) => {
                        setForm((prev) => ({
                          ...prev,
                          phone: formatPhoneInput(event.target.value),
                        }));
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "booking-phone-error" : undefined
                      }
                    />
                    {errors.phone ? (
                      <p
                        id="booking-phone-error"
                        className="booking__error"
                        role="alert"
                      >
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>

                  <div className="booking__field">
                    <label className="booking__label" htmlFor="booking-comment">
                      Комментарий
                    </label>
                    <textarea
                      id="booking-comment"
                      name="comment"
                      rows={2}
                      className="booking__textarea"
                      placeholder="Расскажи немного о своей идее или пожеланиях"
                      value={form.comment}
                      disabled={status === "loading"}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          comment: event.target.value,
                        }))
                      }
                    />
                  </div>

                  {status === "error" && statusMessage ? (
                    <p className="booking__form-error" role="alert">
                      {statusMessage}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className="booking__submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? "Отправляем…" : "Оставить заявку"}
                    <span className="booking__submit-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </button>

                  <p className="booking__consent">
                    Нажимая кнопку, ты соглашаешься на обработку персональных
                    данных для связи по заявке.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
