import { supabase } from "../supabase-client.js";

export const loader = ({ request }) => {
  const url = new URL(request.url);
  const isFetchingPrivate = url.pathname === "/private-posts";
  const postsPromise = new Promise((resolve, reject) => {
    let query = supabase
      .from("Posts")
      .select("id,created_at,title,author,avatar,is_private")
      .order("created_at", { ascending: false });

    if (isFetchingPrivate) {
      query = query.eq("is_private", true);
    } else {
      query = query.eq("is_private", false);
    }

    query
      .then(({ data, error }) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
  return { postsData: postsPromise };
};
