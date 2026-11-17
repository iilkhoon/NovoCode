import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Masters from "./components/Masters";
import Booking from "./components/Booking";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Services />
        <Masters />
        <Booking />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
