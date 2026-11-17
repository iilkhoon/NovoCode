import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Doctors from "./components/Doctors";
import Booking from "./components/Booking";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Services />
        <Doctors />
        <Booking />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
