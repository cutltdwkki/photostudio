import Header from "../components/Header";
import Hero from "../components/Hero";
import Stories from "../components/Stories";
import Services from "../components/Services";

export default function Home() {
  return (
    <div className="site-main">
      <Header />
      <main>
        <Hero />
        <Stories />
        <Services />
        {/* Zero-height anchors for nav until sections exist */}
        <div id="gallery" className="site-anchor" />
        <div id="reviews" className="site-anchor" />
        <div id="faq" className="site-anchor" />
        {/* Booking form — connect when form section is ready */}
        <div id="booking" className="site-anchor" />
      </main>
    </div>
  );
}
