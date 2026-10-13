"use client";

import { useSectionReveal } from "@/hooks/useSectionReveal";

const NAV_LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#gallery", label: "Галерея" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "Вопросы" },
] as const;

/** Static copyright year — avoid `new Date()` in Client Components (Next.js prerender). */
const COPYRIGHT_YEAR = 2026;

export default function Footer() {
  const { ref: footerRef, revealed } = useSectionReveal<HTMLElement>({
    threshold: 0.06,
    rootMargin: "0px 0px 0px 0px",
    visibleTopRatio: 0.95,
  });

  return (
    <footer
      ref={footerRef}
      className={`site-footer${revealed ? " is-revealed" : ""}`}
      aria-label="Подвал сайта"
    >
      <div className="site-footer__inner">
        <div className="site-footer__grid footer-reveal">
          <div className="site-footer__col site-footer__col--brand">
            <p className="site-footer__brand-label">
              PHOTO DREAM<span className="site-footer__reg">®</span>
            </p>
            <p className="site-footer__brand-text">
              Пространство для съёмок, экспериментов и идей, которые хочется
              воплотить.
            </p>
            <p className="site-footer__copy">© {COPYRIGHT_YEAR} PHOTO DREAM</p>
          </div>

          <nav className="site-footer__col" aria-label="Навигация в подвале">
            <p className="site-footer__col-label">Навигация</p>
            <ul className="site-footer__list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="site-footer__link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__col">
            <p className="site-footer__col-label">Бронирование</p>
            <p className="site-footer__col-text">
              Забронируй время для своей съёмки.
            </p>
            <a href="#booking" className="site-footer__book">
              Оставить заявку
              <span className="site-footer__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>

        <div className="site-footer__rule footer-reveal" aria-hidden="true" />

        <p
          className="site-footer__mark footer-reveal footer-reveal--mark"
          aria-hidden="true"
        >
          <span className="site-footer__mark-text">PHOTO DREAM</span>
          <span className="site-footer__mark-reg">®</span>
        </p>
      </div>
    </footer>
  );
}
