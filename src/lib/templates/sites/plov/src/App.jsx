import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Delivery from "./components/Delivery";
import Reserve from "./components/Reserve";
import OrderPanel from "./components/OrderPanel";
import Footer from "./components/Footer";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header onOrder={() => setOpen(true)} />
      <main>
        <Hero />
        <Menu />
        <Delivery />
        <Reserve />
      </main>
      <Footer />
      <OrderPanel open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} />
    </div>
  );
}
