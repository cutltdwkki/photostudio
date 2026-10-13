"use client";

import { useEffect, useId, useState } from "react";

/* Replace href values with real profile URLs when ready */
const SOCIAL_LINKS = [
  { href: "#", label: "INSTAGRAM*" },
  { href: "#", label: "TELEGRAM" },
  { href: "#", label: "VKONTAKTE" },
] as const;

const NAV_LINKS = [
  { href: "#services", label: "УСЛУГИ" },
  { href: "#gallery", label: "ГАЛЕРЕЯ" },
  { href: "#reviews", label: "ОТЗЫВЫ" },
  { href: "#faq", label: "ВОПРОСЫ" },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const threshold = 16;
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = () => setOpen(false);
  const elevated = scrolled || open;

  return (
    <header
      className={`site-header hero-reveal${elevated ? " is-scrolled" : ""}`}
    >
      <div className="site-header__bar">
        <ul className="site-header__socials" aria-label="Социальные сети">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label} className="site-header__cell">
              <a
                href={link.href}
                className="site-header__cell-link"
                onClick={(event) => {
                  if (link.href === "#") event.preventDefault();
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <nav className="site-header__nav" aria-label="Основная навигация">
          <ul className="site-header__nav-list">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="site-header__cell">
                <a href={link.href} className="site-header__cell-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#top" className="site-header__brand" onClick={closeMenu}>
          PHOTO DREAM
        </a>

        <button
          type="button"
          className="site-header__menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="site-header__menu-label">МЕНЮ</span>
          <span className="site-header__menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {open ? (
        <div id={menuId} className="site-header__drawer is-open">
          <nav aria-label="Мобильная навигация">
            <ul className="site-header__drawer-list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="site-header__drawer-link"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="site-header__drawer-socials" aria-label="Социальные сети">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="site-header__drawer-link"
                  onClick={(event) => {
                    closeMenu();
                    if (link.href === "#") event.preventDefault();
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Booking form section TBD — temporary anchor */}
          <a
            href="#booking"
            className="site-header__drawer-cta"
            onClick={closeMenu}
          >
            ЗАБРОНИРОВАТЬ →
          </a>
        </div>
      ) : null}
    </header>
  );
}
