import { toast } from "react-hot-toast";
import { supabase } from "../supabase-client.js";

export const loader = ({ params }) => {
  const postPromise = new Promise((resolve, reject) => {
    supabase
      .from("Posts")
      .select("*")
      .eq("id", params.id)
      .then(({ data, error }) => {
        if (error) {
          toast.error("Failed to load post, please refresh the page");
          reject(error);
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        toast.error("Failed to load post, please refresh the page");
        reject(err);
      });
  });
  return { postData: postPromise };
};
