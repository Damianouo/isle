import { supabase } from "../supabase-client.js";
import { toast } from "react-hot-toast";

export const postLoader = async ({ params }) => {
  const { data, error } = await supabase.from("Posts").select("*").eq("id", params.id);
  if (error) {
    toast.error("Failed to load post, please refresh the page");
    return null;
  } else {
    return data;
  }
};
