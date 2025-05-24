import { cn } from "../../utils/cn.js";

function ExpandIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("icon", className)}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 6l10 0" />
      <path d="M4 18l10 0" />
      <path d="M4 12h17l-3 -3m0 6l3 -3" />
    </svg>
  );
}

export default ExpandIcon;
