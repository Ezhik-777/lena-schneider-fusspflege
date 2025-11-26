import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Benefits />
        <Contact />
        <BookingForm />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
