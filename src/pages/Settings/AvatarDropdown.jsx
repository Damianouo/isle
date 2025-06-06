import { avatarImages } from "../../assets/images/avatars";

function AvatarDropdown({ selectedAvatar, handleSelectAvatar }) {
  return (
    <div className="dropdown w-fit">
      <div
        tabIndex={0}
        role="button"
        className="btn outline-primary btn-circle m-1 h-24 w-24 p-0 outline-2"
      >
        {selectedAvatar?.length > 0 ? (
          <img src={selectedAvatar} alt="avatar image" className="size-full" />
        ) : (
          <p>Choose</p>
        )}
      </div>
      <ul className="menu dropdown-content bg-base-200 rounded-box grid w-64 grid-cols-3 items-center justify-items-center gap-4 p-2 shadow-sm">
        {Array.from({ length: 9 }).map((v, i) => (
          <AvatarItem key={i} image={avatarImages[i]} handleSelectAvatar={handleSelectAvatar} />
        ))}
      </ul>
    </div>
  );
}

export default AvatarDropdown;

const AvatarItem = ({ image, handleSelectAvatar }) => {
  return (
    <li className="">
      <button
        className="skeleton btn active:outline-primary h-16 w-16 rounded-full p-0 outline-2 outline-transparent transition hover:opacity-70"
        onClick={handleSelectAvatar}
      >
        <img src={image} alt="avatar image" className="size-full" />
      </button>
    </li>
  );
};
