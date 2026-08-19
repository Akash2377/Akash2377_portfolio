import { LazyMotion, domAnimation } from "motion/react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import About from "./components/About";
import Path from "./components/Path";
import Process from "./components/Process";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useHashLanding } from "./lib/useHashLanding";

export default function App() {
  useHashLanding();

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="grain min-h-dvh">
        <Nav />
        <main id="main">
          <Hero />
          <Work />
          <About />
          <Path />
          <Process />
        <Faq />
          <Contact />
        </main>
        {/* Clears the fixed bottom bar on phones. */}
        <Footer className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0" />
      </div>
    </LazyMotion>
  );
}
