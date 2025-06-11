import { supabase } from "../supabase-client.js";
import { toast } from "react-hot-toast";

export const postListLoader = async () => {
  const { data, error } = await supabase
    .from("Posts")
    .select("id,created_at,title,author,avatar")
    .order("created_at", { ascending: false });

  if (error) {
    toast.error("Failed to load posts, please refresh the page");
    return null;
  } else {
    return data;
  }
};
