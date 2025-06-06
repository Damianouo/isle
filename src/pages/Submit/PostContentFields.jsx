import { useEffect, useRef } from "react";

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function PostContentFields({ postContent, setPostContent }) {
  const contentTextAreaRef = useRef(null);

  useEffect(() => {
    if (contentTextAreaRef.current) {
      autoResize(contentTextAreaRef.current);
    }
  }, []);

  const handleChange = ({ target }) => {
    if (target.name === "content") {
      autoResize(target);
    }
    const nextPostContent = {
      ...postContent,
      [target.name]: target.name === "is_private" ? target.checked : target.value,
    };
    setPostContent(nextPostContent);
  };

  return (
    <>
      {/*Private*/}
      <div>
        <div className="flex items-center gap-4">
          <p className="text-xl font-semibold">Private</p>
          <input
            type="checkbox"
            name="is_private"
            className="toggle toggle-secondary border-2"
            onChange={handleChange}
            checked={postContent.is_private}
          />
        </div>
      </div>

      {/*Title*/}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Title</legend>
        <input
          type="text"
          className="input w-full"
          name="title"
          placeholder="The title"
          value={postContent.title}
          onChange={handleChange}
        />
      </fieldset>
      {/*content*/}
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Content</legend>
        <textarea
          className="textarea min-h-48 w-full"
          name="content"
          placeholder="Share your thoughts"
          value={postContent.content}
          onChange={handleChange}
          ref={contentTextAreaRef}
        ></textarea>
      </fieldset>
    </>
  );
}

export default PostContentFields;
