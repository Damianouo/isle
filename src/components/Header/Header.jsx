import { Link } from "react-router";
import ThemeChanger from "./ThemeChanger.jsx";
import SearchBtn from "./SearchBtn.jsx";

function Header() {
  return (
    <header className="navbar bg-base-300 gap-4 shadow-sm">
      <Link to="/" className="px-2 text-xl">
        Isle
      </Link>
      <SearchBtn />
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeChanger />
        <Link to="/settings" className="avatar rounded-full transition-opacity hover:opacity-75">
          <div className="icon rounded-full">
            <img
              src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
              alt="avatar"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
