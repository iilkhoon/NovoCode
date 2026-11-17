import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import About from "./components/About";
import Reviews from "./components/Reviews";
import Reservation from "./components/Reservation";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Menu />
        <About />
        <Reviews />
        <Reservation />
      </main>
      <Footer />
    </div>
  );
}
