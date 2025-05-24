import { useOutlet } from "react-router";
import Header from "../components/Header/Header.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import PageTransition from "./PageTransition.jsx";

function Root() {
  const outlet = useOutlet();
  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <Header />
      <div className="grid grid-cols-[auto_1fr]">
        <Navbar />
        <main className="relative grid">
          <PageTransition>{outlet}</PageTransition>
        </main>
      </div>
    </div>
  );
}

export default Root;
