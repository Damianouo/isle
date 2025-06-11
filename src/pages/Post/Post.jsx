import { useLoaderData } from "react-router";
import { useState } from "react";

function Post() {
  const data = useLoaderData();
  const [post] = useState(data?.[0]);
  const paragraphs = post?.content.split(/\r?\n/);
  return (
    <>
      {data ? (
        <div className="prose pt-4">
          <p className="flex items-center gap-2">
            <span>{post?.author}</span>
            <span className="bg-base-content/70 size-0.75 rounded-full"></span>
            <span>{post?.date}</span>
          </p>
          <h1>{post?.title}</h1>

          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <div className="prose pt-4">
          <p>
            From <b>Drifter</b>
          </p>
          <h1>The post you're looking for no longer exists.</h1>
          <p>It has been deleted.</p>
        </div>
      )}
    </>
  );
}

export default Post;
