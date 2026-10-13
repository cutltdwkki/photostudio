import Header from "../components/Header";
import Hero from "../components/Hero";
import Studio from "../components/Studio";
import Services from "../components/Services";

export default function Home() {
  return (
    <div className="site-main">
      <Header />
      <main>
        <Hero />
        <Studio />
        <Services />
        {/* Zero-height anchors for nav until sections exist */}
        <div id="prices" className="site-anchor" />
        <div id="gallery" className="site-anchor" />
        <div id="reviews" className="site-anchor" />
        <div id="booking" className="site-anchor" />
      </main>
    </div>
  );
}
