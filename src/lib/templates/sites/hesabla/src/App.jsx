import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Demo from "./components/Demo";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Faq />
        <Demo />
      </main>
      <Footer />
    </div>
  );
}
