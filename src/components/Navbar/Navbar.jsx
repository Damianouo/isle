import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { cn } from "../../utils/cn.js";
import PostIcon from "../../assets/icons/PostIcon.jsx";
import PrivatePostIcon from "../../assets/icons/PrivatePostIcon.jsx";
import WritingIcon from "../../assets/icons/WritingIcon.jsx";
import ExpandIcon from "../../assets/icons/ExpandIcon.jsx";
import { useSession } from "../../contexts/SessionContext.jsx";
import LoginIcon from "../../assets/icons/LoginIcon.jsx";
import { usePostPreferences } from "../../contexts/PostPreferencesContext.jsx";
import UserIcon from "../../assets/icons/UserIcon.jsx";

function Navbar({ className, drawerIsOpen }) {
  const [isOpen, setIsOpen] = useState(() => {
    const preferOpen = localStorage.getItem("isNavbarOpen");
    return preferOpen === "true";
  });
  const { session } = useSession();

  useEffect(() => {
    localStorage.setItem("isNavbarOpen", String(isOpen));
  }, [isOpen]);

  return (
    <aside
      className={cn(
        "bg-base-200 hidden flex-col p-2 transition-all md:flex",
        drawerIsOpen ? "min-w-60" : isOpen ? "min-w-60" : "min-w-0",
        className,
      )}
    >
      <div
        className="tooltip tooltip-right self-end md:mb-8"
        data-tip={isOpen ? "Collapse" : "Expand"}
      >
        <button
          className="btn btn-ghost hidden md:inline-flex"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <ExpandIcon
            className={cn("icon transition-transform", isOpen ? "rotate-180" : "rotate-0")}
          />
        </button>
      </div>
      <nav className="flex h-full flex-col justify-between pb-8">
        <ul>
          <StyledNavLink
            to="/posts"
            icon={<PostIcon />}
            text="Posts"
            isOpen={drawerIsOpen ? drawerIsOpen : isOpen}
          />
          <StyledNavLink
            to="/private-posts"
            icon={<PrivatePostIcon />}
            text="Private Posts"
            isOpen={drawerIsOpen ? drawerIsOpen : isOpen}
          />
          <StyledNavLink
            to="/submit"
            icon={<WritingIcon />}
            text="Create Post"
            isOpen={drawerIsOpen ? drawerIsOpen : isOpen}
          />
        </ul>
        <ul>
          <StyledNavLink
            to="/report"
            icon={<PostIcon />}
            text="Bug Report"
            isOpen={drawerIsOpen ? drawerIsOpen : isOpen}
          />
          {session ? (
            <UserPanel isOpen={drawerIsOpen ? drawerIsOpen : isOpen} />
          ) : (
            <StyledNavLink
              to="/login"
              icon={<LoginIcon />}
              text="Login"
              isOpen={drawerIsOpen ? drawerIsOpen : isOpen}
            />
          )}
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

function UserPanel({ isOpen }) {
  const { postPreferences } = usePostPreferences();
  const { author, avatar } = postPreferences;
  const displayName = author.length > 0 ? author : "Anonymous";
  const displayAvatar =
    avatar.length > 0 ? (
      <div className="avatar">
        <div className="h-8 w-8 rounded-full">
          <img src={avatar} alt="avatar" />
        </div>
      </div>
    ) : (
      <UserIcon />
    );
  return (
    <li className={cn("tooltip-right", !isOpen && "tooltip")} data-tip={displayName}>
      <NavLink
        to="/settings"
        id="user-panel"
        className={cn(
          "btn btn-soft btn-secondary grid gap-0 transition-all",
          isOpen ? "grid-cols-[auto_1fr]" : "grid-cols-[auto_0fr]",
        )}
      >
        {displayAvatar}
        <span
          className={cn(
            "line-clamp-1 overflow-hidden text-left text-lg",
            isOpen ? "pl-2 opacity-100 delay-200 duration-300" : "pl-0 opacity-0",
          )}
        >
          {displayName}
        </span>
      </NavLink>
    </li>
  );
}
