import { Link } from "react-router";
import { supabase } from "../../supabase-client.js";
import { toast } from "react-hot-toast";
import useLocalStorage from "../../hooks/useLocalStorage.jsx";
import { useEffect, useRef } from "react";

const initialPostContent = {
  author: "NONAME",
  is_private: false,
  title: "",
  content: "",
};

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

function Submit() {
  const [postContent, setPostContent] = useLocalStorage("unsavedPostContent", initialPostContent);
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

    let nextPostContent;
    if (target.name === "is_private") {
      nextPostContent = {
        ...postContent,
        is_private: target.checked,
      };
    } else {
      nextPostContent = {
        ...postContent,
        [target.name]: target.value,
      };
    }
    setPostContent(nextPostContent);
  };
  const handleSubmit = async () => {
    const toastId = toast.loading("Creating post...");
    const { error } = await supabase.from("Posts").insert([postContent]).select();
    if (error) {
      toast.error(error.details, { id: toastId });
    } else {
      toast.success("Post created!", { id: toastId });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="my-6 text-4xl font-bold">Create Post</h1>
        <button className="btn btn-neutral">Drafts</button>
      </div>
      <form className="space-y-4">
        {/*Name*/}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input
            type="text"
            className="input"
            name="author"
            placeholder="Your Name"
            value={postContent.author}
            onChange={handleChange}
          />
          <p className="label">
            * You can save the default value for <b>Name</b> in
            <Link to="/settings" className="link link-secondary transition-colors">
              Settings
            </Link>
          </p>
        </fieldset>
        {/*Private*/}
        <div>
          <div className="flex items-center gap-4">
            <p className="text-xl">Private</p>
            <input
              type="checkbox"
              name="is_private"
              className="toggle toggle-secondary"
              onChange={handleChange}
              checked={postContent.is_private}
            />
          </div>
          <p className="text-base-content/60 text-sm">
            * Private posts are only visible to you and <b>Drifter</b>.
          </p>
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
      </form>
      {/*submit*/}
      <div className="mt-6 flex items-center justify-end gap-4">
        <button className="btn btn-secondary" onClick={handleSubmit}>
          Create Post
        </button>
        <button className="btn btn-neutral">Save Draft</button>
      </div>
    </div>
  );
}

export default Submit;
