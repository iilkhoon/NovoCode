import Header from "./components/Header";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import Quiz from "./components/Quiz";
import Teachers from "./components/Teachers";
import Signup from "./components/Signup";

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <Courses />
        <Quiz />
        <Teachers />
        <Signup />
      </main>
      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        <span className="font-display font-bold text-foreground">lingo.</span> · 28 May küç. 3, Bakı · +994 50 288 28 28 · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
