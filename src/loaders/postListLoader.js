import { supabase } from "../supabase-client.js";
import { toast } from "react-hot-toast";

export const loader = () => {
  const postsPromise = new Promise((resolve, reject) => {
    supabase
      .from("Posts")
      .select("id,created_at,title,author,avatar")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error("Fail to load posts, please refresh the page");
          reject(error);
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        toast.error("Fail to load posts, please refresh the page");
        reject(err);
      });
  });
  return { postsData: postsPromise };
};
