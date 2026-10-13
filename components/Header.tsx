"use client";

import { useEffect, useId, useState } from "react";

const NAV_LINKS = [
  { href: "#studio", label: "Студия" },
  { href: "#services", label: "Услуги" },
  { href: "#prices", label: "Цены" },
  { href: "#gallery", label: "Галерея" },
  { href: "#reviews", label: "Отзывы" },
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
    <header className={`site-header${elevated ? " is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <a href="#top" className="site-logo" onClick={closeMenu}>
          STUDIO 01
        </a>

        <nav className="site-nav" aria-label="Основная навигация">
          <ul className="site-nav__list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="site-nav__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#booking" className="site-header__cta">
          Забронировать
        </a>

        <button
          type="button"
          className="site-header__menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
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
          <a
            href="#booking"
            className="site-header__drawer-cta"
            onClick={closeMenu}
          >
            Забронировать
          </a>
        </div>
      ) : null}
    </header>
  );
}
