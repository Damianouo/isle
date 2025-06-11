import PostAuthorFields from "./PostAuthorFields.jsx";
import PostContentFields from "./PostContentFields.jsx";
import { useSession } from "../../contexts/SessionContext.jsx";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabase-client.js";
import { usePostPreferences } from "../../contexts/PostPreferencesContext.jsx";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage.jsx";

const initialPostAuthor = {
  author: "NONAME",
  avatar: "",
};

const initialPostContent = {
  is_private: false,
  title: "",
  content: "",
};

function PostForm() {
  const { postPreferences } = usePostPreferences();
  const [postAuthor, setPostAuthor] = useState(() => {
    const { author, avatar } = postPreferences;
    if (author.length > 0 || avatar.length > 0) {
      return { author, avatar };
    } else {
      return initialPostAuthor;
    }
  });

  const [postContent, setPostContent] = useLocalStorage("unsavedPostContent", initialPostContent);

  const { session } = useSession();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating post...");
    const { data, error } = await supabase
      .from("Posts")
      .insert({ ...postAuthor, ...postContent, user_id: session.id })
      .select();
    if (error) {
      toast.error("Fail to create post, please try again later", { id: toastId });
    } else {
      toast.success("Post created!", { id: toastId });
      localStorage.removeItem("unsavedPostContent");
      navigate(`/post/${data[0].id}`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="my-6 text-4xl font-bold">Create Post</h1>
        <button className="btn btn-neutral">Drafts</button>
      </div>
      <form className="space-y-4">
        <PostAuthorFields postAuthor={postAuthor} setPostAuthor={setPostAuthor} />
        <PostContentFields postContent={postContent} setPostContent={setPostContent} />
        {/*submit*/}
        <div className="mt-6 flex items-center justify-end gap-4">
          <button className="btn btn-secondary" onClick={handleSubmit}>
            Create Post
          </button>
          <button className="btn btn-neutral">Save Draft</button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
