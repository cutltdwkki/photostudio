"use client";

import {
  useCallback,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

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

/** Fixed demo range as static ISO days — no `Date` (avoids SSR/client timezone drift). */
type CalendarDay = { iso: string; label: number };
type MonthGroup = { key: string; label: string; days: CalendarDay[] };

function buildMonthDays(
  year: number,
  month: number,
  fromDay: number,
  toDay: number,
): CalendarDay[] {
  const days: CalendarDay[] = [];
  for (let day = fromDay; day <= toDay; day += 1) {
    days.push({
      iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      label: day,
    });
  }
  return days;
}

const CALENDAR_GROUPS: MonthGroup[] = [
  {
    key: "2026-10",
    label: "ОКТЯБРЯ",
    days: buildMonthDays(2026, 10, 13, 31),
  },
  {
    key: "2026-11",
    label: "НОЯБРЯ",
    days: buildMonthDays(2026, 11, 1, 12),
  },
];

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
              const selectedDay = selected === day.iso;
              return (
                <button
                  key={day.iso}
                  type="button"
                  role="option"
                  aria-selected={selectedDay}
                  className={`services__day${selectedDay ? " is-selected" : ""}`}
                  onClick={() => onSelect(day.iso)}
                >
                  {day.label}
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
  const { ref: sectionRef, revealed } = useSectionReveal<HTMLElement>({
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
    visibleTopRatio: 0.85,
  });
  const [selectedByService, setSelectedByService] = useState<
    Partial<Record<ServiceId, string>>
  >({});

  const selectDate = useCallback((id: ServiceId, iso: string) => {
    setSelectedByService((prev) => ({ ...prev, [id]: iso }));
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
