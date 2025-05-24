import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn.js";
import PostIcon from "../../assets/icons/PostIcon.jsx";
import PrivatePostIcon from "../../assets/icons/PrivatePostIcon.jsx";
import WritingIcon from "../../assets/icons/WritingIcon.jsx";
import ExpandIcon from "../../assets/icons/ExpandIcon.jsx";

function Navbar() {
  const [isOpen, setIsOpen] = useState(() => {
    const preferOpen = localStorage.getItem("isNavbarOpen");
    return preferOpen === "true";
  });

  useEffect(() => {
    localStorage.setItem("isNavbarOpen", String(isOpen));
  }, [isOpen]);

  return (
    <aside
      className={cn(
        "bg-base-200 flex flex-col p-2 transition-all",
        isOpen ? "min-w-60" : "min-w-0",
      )}
    >
      <div className="tooltip tooltip-right self-end" data-tip={isOpen ? "Collapse" : "Expand"}>
        <button className="btn btn-ghost" onClick={() => setIsOpen((prev) => !prev)}>
          <ExpandIcon
            className={cn("icon transition-transform", isOpen ? "rotate-180" : "rotate-0")}
          />
        </button>
      </div>
      <nav>
        <ul>
          <StyledNavLink to="/posts" icon={<PostIcon />} text="Posts" isOpen={isOpen} />
          <StyledNavLink
            to="/privatePosts"
            icon={<PrivatePostIcon />}
            text="Private Posts"
            isOpen={isOpen}
          />
          <StyledNavLink to="/submit" icon={<WritingIcon />} text="Create Post" isOpen={isOpen} />
        </ul>
      </nav>
    </aside>
  );
}

export default Navbar;

function StyledNavLink({ to, icon, text, isOpen }) {
  return (
    <li className={cn("tooltip-right", !isOpen && "tooltip")} data-tip={text}>
      <NavLink
        to={to}
        className={cn(
          "btn btn-ghost grid gap-0 transition-all",
          isOpen ? "grid-cols-[auto_1fr]" : "grid-cols-[auto_0fr]",
        )}
      >
        {icon}
        <span
          className={cn(
            "line-clamp-1 overflow-hidden text-left text-lg",
            isOpen ? "pl-2 opacity-100 delay-200 duration-300" : "pl-0 opacity-0",
          )}
        >
          {text}
        </span>
      </NavLink>
    </li>
  );
}
