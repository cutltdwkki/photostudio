export default function Hero() {
  return (
    <section id="top" className="hero" aria-label="Главный экран">
      <div className="hero__media" aria-hidden="true">
        <div className="hero__image" />
        <div className="hero__overlay" />
      </div>

      <div className="site-grid hero__grid">
        <div className="hero__content">
          <h1 className="hero__title hero-reveal hero-reveal--1">
            <span className="hero__title-line">Ваша&nbsp;история.</span>
            <span className="hero__title-line hero__title-line--from-3">
              Наш&nbsp;кадр.
            </span>
          </h1>

          <div className="hero__intro hero-reveal hero-reveal--2">
            <p className="hero__eyebrow">[Фотостудия в Москве]</p>
            <p className="hero__lead">
              Пространство для съёмок, в которых есть настроение.
            </p>
          </div>

          <div className="hero__meta hero-reveal hero-reveal--3">
            <p className="hero__location">
              <img
                src="/images/location.svg"
                alt=""
                width={16}
                height={16}
                className="hero__location-icon"
              />
              <span>Москва, м. Воробьёвы горы</span>
            </p>
            <p className="hero__price">Аренда от 999 ₽ / час</p>
          </div>

          <a href="#booking" className="hero__cta hero-reveal hero-reveal--4">
            Забронировать студию
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
