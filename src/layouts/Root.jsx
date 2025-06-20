import Header from "../components/Header/Header.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import PageTransition from "./PageTransition.jsx";
import { Toaster } from "react-hot-toast";

function Root() {
  return (
    <>
      <div className="grid h-screen grid-rows-[auto_1fr]">
        <Header />
        <div className="grid grid-cols-[auto_1fr] overflow-y-auto">
          <Navbar />
          <main className="relative grid h-full justify-items-center overflow-y-auto">
            <PageTransition />
          </main>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default Root;
