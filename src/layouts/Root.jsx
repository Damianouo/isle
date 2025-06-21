import Header from "../components/Header/Header.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import PageTransition from "./PageTransition.jsx";
import { Toaster } from "react-hot-toast";

function Root() {
  return (
    <>
      <div className="grid h-screen grid-rows-[auto_1fr]">
        <Header />
        <div className="grid overflow-y-auto md:grid-cols-[auto_1fr]">
          <Navbar />
          <main className="relative grid h-full justify-items-center overflow-y-scroll">
            <PageTransition />
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Root;
