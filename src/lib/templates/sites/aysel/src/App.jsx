import Header from "./components/Header";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Packages from "./components/Packages";
import Contact from "./components/Contact";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Packages />
        <Contact />
      </main>
      <footer className="border-t border-border py-8 text-center text-xs tracking-[0.2em] text-muted-foreground">© {new Date().getFullYear()} AYSEL MƏMMƏDOVA · BAKI</footer>
    </div>
  );
}
