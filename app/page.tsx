import Header from "../components/Header";
import Hero from "../components/Hero";
import Stories from "../components/Stories";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import Reviews from "../components/Reviews";
import Cta from "../components/Cta";
import Faq from "../components/Faq";
import Booking from "../components/Booking";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="site-main">
      <Header />
      <main>
        <Hero />
        <Stories />
        <Services />
        <Cta />
        <Gallery />
        <Reviews />
        <Faq />
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
