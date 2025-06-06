import AvatarDropdown from "../Settings/AvatarDropdown.jsx";

function PostAuthorFields({ postAuthor, setPostAuthor }) {
  const handleChange = ({ target }) => {
    setPostAuthor({ ...postAuthor, [target.name]: target.value });
  };

  const handleSelectAvatar = (e) => {
    e.preventDefault();
    const { target } = e;
    setPostAuthor((prev) => ({ ...prev, avatar: target.src }));
  };

  return (
    <>
      {/*Name*/}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Name</legend>
        <input
          type="text"
          className="input"
          placeholder="Name"
          name="author"
          value={postAuthor.author}
          onChange={handleChange}
        />
      </fieldset>
      {/*Avatar*/}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Avatar</legend>
        <div className="flex items-center gap-4">
          <AvatarDropdown
            selectedAvatar={postAuthor.avatar}
            handleSelectAvatar={handleSelectAvatar}
          />
        </div>
      </fieldset>
    </>
  );
}

export default PostAuthorFields;
