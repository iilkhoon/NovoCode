import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import Story from "./components/Story";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header onCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Catalog onAdded={() => setCartOpen(true)} />
        <Story />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
