import { supabase } from "../supabase-client.js";

export const loader = ({ params }) => {
  const postPromise = new Promise((resolve, reject) => {
    supabase
      .from("Posts")
      .select("*")
      .eq("id", params.id)
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
  return { postData: postPromise };
};
