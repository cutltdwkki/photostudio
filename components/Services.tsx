"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

type ServiceId = "rent" | "photographer" | "zone";

type ServiceItem = {
  id: ServiceId;
  category: string;
  title: string;
  text: string;
  priceLabel: string;
  priceValue: number;
  image: string;
  imageAlt: string;
};

const imagePath = (filename: string) =>
  `/images/${filename.split("/").map(encodeURIComponent).join("/")}`;

const SERVICES: ServiceItem[] = [
  {
    id: "rent",
    category: "Аренда пространства",
    title: "Аренда студии",
    text: "Твоё пространство для съёмок, экспериментов со светом и собственных идей. Выбирай нужную дату, привози команду и работай в своём ритме.",
    priceLabel: "1 990 ₽ / ЧАС",
    priceValue: 1990,
    image: imagePath("Аренда студии.jpg"),
    imageAlt: "Аренда студии — интерьер пространства",
  },
  {
    id: "photographer",
    category: "Съёмка под ключ",
    title: "Студия с фотографом",
    text: "Тебе не нужно думать о настройках камеры и свете. Фотограф поможет с позированием, подберёт ракурсы и создаст кадры, которые захочется сохранить.",
    priceLabel: "6 990 ₽ / ЧАС",
    priceValue: 6990,
    image: imagePath("Студия с фотографом.png"),
    imageAlt: "Студия с фотографом — съёмка в кадре",
  },
  {
    id: "zone",
    category: "Готовая локация",
    title: "Фотозона",
    text: "Выбирай подходящий интерьер для портретов, контента и небольших проектов. Готовая композиция, красивый свет и пространство, в котором легко воплотить свою идею.",
    priceLabel: "1 490 ₽ / ЧАС",
    priceValue: 1490,
    image: imagePath("Фотозона2.jpg"),
    imageAlt: "Фотозона — готовая локация",
  },
];

/** Fixed demo range: 13 Oct 2026 → 12 Nov 2026 */
const RANGE_START = new Date(2026, 9, 13);
const RANGE_END = new Date(2026, 10, 12);

const MONTH_GENITIVE = [
  "ЯНВАРЯ",
  "ФЕВРАЛЯ",
  "МАРТА",
  "АПРЕЛЯ",
  "МАЯ",
  "ИЮНЯ",
  "ИЮЛЯ",
  "АВГУСТА",
  "СЕНТЯБРЯ",
  "ОКТЯБРЯ",
  "НОЯБРЯ",
  "ДЕКАБРЯ",
] as const;

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type MonthGroup = {
  key: string;
  label: string;
  days: Date[];
};

function buildFixedRange(): MonthGroup[] {
  const groups: MonthGroup[] = [];
  const map = new Map<string, MonthGroup>();
  let day = new Date(RANGE_START);

  while (day.getTime() <= RANGE_END.getTime()) {
    const key = `${day.getFullYear()}-${day.getMonth()}`;
    let group = map.get(key);
    if (!group) {
      group = {
        key,
        label: MONTH_GENITIVE[day.getMonth()],
        days: [],
      };
      map.set(key, group);
      groups.push(group);
    }
    group.days.push(new Date(day));
    day = addDays(day, 1);
  }

  return groups;
}

const CALENDAR_GROUPS = buildFixedRange();

function ServiceCalendar({
  serviceId,
  selected,
  onSelect,
}: {
  serviceId: ServiceId;
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  return (
    <div className="services__calendar" data-service={serviceId}>
      {CALENDAR_GROUPS.map((group) => (
        <div key={group.key} className="services__calendar-month">
          <p className="services__calendar-label">{group.label}</p>
          <div className="services__calendar-days" role="listbox" aria-label={group.label}>
            {group.days.map((day) => {
              const iso = toISODate(day);
              const selectedDay = selected === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  role="option"
                  aria-selected={selectedDay}
                  className={`services__day${selectedDay ? " is-selected" : ""}`}
                  onClick={() => onSelect(iso)}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {/* TODO: replace demo availability with real booking availability API */}
    </div>
  );
}

function ServiceRow({
  service,
  selectedDate,
  onSelectDate,
  stagger,
}: {
  service: ServiceItem;
  selectedDate: string | null;
  onSelectDate: (iso: string) => void;
  stagger: string;
}) {
  const bookHref = useMemo(() => {
    const params = new URLSearchParams({
      service: service.id,
      price: String(service.priceValue),
    });
    if (selectedDate) params.set("date", selectedDate);
    return `/?${params.toString()}#booking`;
  }, [service.id, service.priceValue, selectedDate]);

  const onBookClick = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      sessionStorage.setItem(
        "photodream-booking",
        JSON.stringify({
          serviceId: service.id,
          title: service.title,
          date: selectedDate,
          price: service.priceValue,
          priceLabel: service.priceLabel,
        }),
      );
    } catch {
      /* ignore quota / private mode */
    }
    if (!selectedDate) {
      event.preventDefault();
    }
  };

  return (
    <article
      className="services__row services-reveal services-reveal--row"
      style={{ ["--services-stagger" as string]: stagger }}
    >
      <p className="services__category">{service.category}</p>

      <div className="services__info">
        <h3 className="services__title">{service.title}</h3>
        <p className="services__text">{service.text}</p>
        <ServiceCalendar
          serviceId={service.id}
          selected={selectedDate}
          onSelect={onSelectDate}
        />
      </div>

      <div className="services__media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt=""
          className="services__image"
          width={300}
          height={370}
        />
      </div>

      <div className="services__aside">
        <p className="services__price">{service.priceLabel}</p>
        <a
          href={bookHref}
          className="services__book"
          onClick={onBookClick}
          aria-disabled={!selectedDate}
        >
          ЗАБРОНИРОВАТЬ
        </a>
      </div>
    </article>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [selectedByService, setSelectedByService] = useState<
    Partial<Record<ServiceId, string>>
  >({});

  const selectDate = useCallback((id: ServiceId, iso: string) => {
    setSelectedByService((prev) => ({ ...prev, [id]: iso }));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`services site-section${revealed ? " is-revealed" : ""}`}
      aria-label="Услуги и бронирование"
    >
      <h2
        id="services-heading"
        className="services__heading services-reveal services-reveal--heading"
      >
        ПРОСТРАНСТВО ДЛЯ ТВОЕЙ СЪЁМКИ
      </h2>

      <div className="services__list">
        {SERVICES.map((service, index) => (
          <ServiceRow
            key={service.id}
            service={service}
            selectedDate={selectedByService[service.id] ?? null}
            onSelectDate={(iso) => selectDate(service.id, iso)}
            stagger={`${120 + index * 130}ms`}
          />
        ))}
      </div>
    </section>
  );
}
