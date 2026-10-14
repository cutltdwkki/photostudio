"use client";

import { useEffect, useId, useRef, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "01",
    question: "Как забронировать студию?",
    answer:
      "Выбери подходящую услугу и дату в разделе «Услуги», затем оставь заявку. Мы свяжемся с тобой, чтобы подтвердить детали съёмки.",
  },
  {
    id: "02",
    question: "Сколько стоит аренда фотостудии?",
    answer:
      "Стоимость зависит от выбранной услуги и продолжительности съёмки. Актуальные цены указаны в разделе «Услуги».",
  },
  {
    id: "03",
    question: "Что входит в аренду студии?",
    answer:
      "В твоём распоряжении — съёмочное пространство, выбранная фотозона и доступное студийное оборудование. Состав оборудования и условия использования можно уточнить при бронировании.",
  },
  {
    id: "04",
    question: "Можно ли прийти со своим фотографом?",
    answer:
      "Конечно! Ты можешь арендовать пространство для самостоятельной съёмки, пригласить своего фотографа, визажиста или команду. Заранее сообщи нам о количестве участников.",
  },
  {
    id: "05",
    question: "Можно ли снимать контент для коммерческого проекта?",
    answer:
      "Да! Студия подходит для портретов, съёмки одежды, предметного контента, социальных сетей и небольших рекламных проектов. Расскажи нам о своей задаче при бронировании, чтобы мы помогли подготовить пространство.",
  },
  {
    id: "06",
    question: "На сколько часов можно забронировать студию?",
    answer:
      "Продолжительность зависит от твоих задач и выбранного формата. Рекомендуем учитывать время на подготовку, смену образов и настройку света, чтобы спокойно реализовать задуманное.",
  },
  {
    id: "07",
    question: "Можно ли перенести или отменить бронирование?",
    answer:
      "Если планы изменились, свяжись с нами как можно раньше. Возможность переноса или отмены зависит от условий бронирования, которые мы сообщим при подтверждении записи.",
  },
  {
    id: "08",
    question: "Что нужно взять с собой на съёмку?",
    answer:
      "Всё зависит от твоей идеи. Обычно достаточно одежды и аксессуаров для выбранных образов. Если планируешь использовать реквизит или дополнительное оборудование, заранее согласуй это с нами.",
  },
  {
    id: "09",
    question: "Можно ли арендовать студию вместе с фотографом?",
    answer:
      "Да, у нас предусмотрен формат съёмки с фотографом. Выбери соответствующую услугу, а детали и время съёмки мы согласуем с тобой.",
  },
  {
    id: "10",
    question: "Что делать, если я не умею работать со студийным светом?",
    answer:
      "Не переживай — для съёмки не обязательно быть профессиональным фотографом. Ты можешь выбрать аренду студии с фотографом или заранее уточнить доступные варианты помощи с настройкой оборудования.",
  },
];

const COLUMNS = [
  FAQ_ITEMS.slice(0, 5),
  FAQ_ITEMS.slice(5),
];

export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const baseId = useId();
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set());
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let cancelled = false;
    const reveal = () => {
      queueMicrotask(() => {
        if (!cancelled) setRevealed(true);
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      reveal();
      return () => {
        cancelled = true;
      };
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      reveal();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const toggle = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={`faq${revealed ? " is-revealed" : ""}`}
      aria-labelledby="faq-heading"
    >
      <div className="faq__inner site-grid">
        <header className="faq__header faq-reveal span-12">
          <h2 id="faq-heading" className="faq__heading">
            Перед тем, как в кадр
          </h2>
          <p className="faq__lead">
            Есть вопросы перед съёмкой? Собрали всё, что стоит знать перед тем,
            как включить свет и начать создавать.
          </p>
        </header>

        {COLUMNS.map((column, columnIndex) => (
          <div key={columnIndex} className="faq__list faq-reveal span-6">
            {column.map((item) => {
              const isOpen = openIds.has(item.id);
              const panelId = `${baseId}-panel-${item.id}`;
              const buttonId = `${baseId}-button-${item.id}`;

              return (
                <div
                  key={item.id}
                  className={`faq__item${isOpen ? " is-open" : ""}`}
                >
                  <h3 className="faq__question">
                    <button
                      id={buttonId}
                      type="button"
                      className="faq__trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(item.id)}
                    >
                      <span className="faq__question-text">
                        <span className="faq__index" aria-hidden="true">
                          {item.id}.
                        </span>{" "}
                        {item.question}
                      </span>
                      <span className="faq__icon" aria-hidden="true" />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="faq__panel"
                    aria-hidden={!isOpen}
                    inert={!isOpen ? true : undefined}
                  >
                    <div className="faq__panel-inner">
                      <p className="faq__answer">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
