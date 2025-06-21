import { Link, useLocation } from "react-router";
import ThemeChanger from "./ThemeChanger.jsx";
import SearchBtn from "./SearchBtn.jsx";
import ExpandIcon from "../../assets/icons/ExpandIcon.jsx";
import { cn } from "../../utils/cn.js";
import { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar.jsx";

function Header() {
  return (
    <header className="navbar bg-base-300 gap-4 px-4 shadow-sm">
      <NavbarDrawer />
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
        <img src="src/assets/images/isle-logo.png" alt="Isle Website Logo" />
        <span className="hidden md:inline-block">Isle</span>
      </Link>
      <SearchBtn />
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeChanger />
      </div>
    </header>
  );
}

export default Header;

function NavbarDrawer() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const drawerInput = document.querySelector("#navbar-drawer");
    if (drawerInput.checked) {
      drawerInput.checked = false;
      setDrawerIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="drawer grid w-auto md:hidden">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <label
          htmlFor="navbar-drawer"
          className="drawer-button tooltip tooltip-right btn btn-ghost hover:bg-neutral p-0"
          data-tip={drawerIsOpen ? "Collapse" : "Expand"}
          onClick={() => setDrawerIsOpen((prev) => !prev)}
        >
          <ExpandIcon
            className={cn("icon transition-transform", drawerIsOpen ? "rotate-180" : "rotate-0")}
          />
        </label>
      </div>
      <div className="drawer-side top-16 h-[calc(100vh_-_64px)]">
        <label
          htmlFor="navbar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={() => setDrawerIsOpen(() => false)}
        ></label>
        {/* Sidebar content here */}
        <div className="grid h-full">
          <Navbar className="flex" drawerIsOpen={drawerIsOpen} />
        </div>
      </div>
    </div>
  );
}
