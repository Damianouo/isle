import { Form, Link } from "react-router";
import { useState } from "react";

function Submit() {
  const [postContent, setPostContent] = useState(() => {
    const unsavedPostContent = localStorage.getItem("unsavedPostContent");
    if (unsavedPostContent) return JSON.parse(unsavedPostContent);
    return {
      title: "",
      content: "",
    };
  });

  const handleChange = ({ target }) => {
    function autoResize(textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }

    if (target.name === "content") {
      autoResize(target);
    }
    const nextPostContent = {
      ...postContent,
      [target.name]: target.value,
    };
    setPostContent(nextPostContent);

    localStorage.setItem("unsavedPostContent", JSON.stringify(nextPostContent));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="my-6 text-4xl font-bold">Create Post</h1>
        <button className="btn btn-neutral">Drafts</button>
      </div>
      <Form action="" method="post" className="space-y-4">
        {/*Name*/}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input type="text" className="input" placeholder="Your Name" defaultValue="NONAME" />
          <p className="label">
            You can save the default value for <b>Name</b> in
            <Link to="/settings" className="link link-secondary transition-colors">
              Settings
            </Link>
          </p>
        </fieldset>
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
          ></textarea>
        </fieldset>
      </Form>
      {/*submit*/}
      <div className="mt-6 flex items-center justify-end gap-4">
        <button className="btn btn-secondary">Create Post</button>
        <button className="btn btn-neutral">Save Draft</button>
      </div>
    </div>
  );
}

export default Submit;
