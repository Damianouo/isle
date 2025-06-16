import { Suspense, useMemo } from "react";
import { Await } from "react-router";
import { formatDate, formatTime } from "../../utils/formatDateTime.js";

function Post({ loaderData }) {
  const { postData } = loaderData;
  return (
    <Suspense fallback={<PostContentSkeleton />}>
      <Await resolve={postData}>
        {(postData) => <PostContent postData={postData}></PostContent>}
      </Await>
    </Suspense>
  );
}

export default Post;

function PostContent({ postData }) {
  const post = postData[0];
  const paragraphs = post?.content.split(/\r?\n/);
  const displayDate = useMemo(() => formatDate(post.created_at), [post.created_at]);
  const displayTime = useMemo(() => formatTime(post.created_at), [post.created_at]);
  return (
    <>
      {post ? (
        <div className="prose prose-img:m-0 py-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={post.avatar} alt="avatar" />
              </div>
            </div>
            <span>{post.author}</span>
            <span className="bg-base-content/70 size-0.75 rounded-full"></span>
            <span
              className="tooltip tooltip-bottom cursor-pointer leading-none"
              data-tip={displayTime}
            >
              <span className="inline-block underline decoration-transparent underline-offset-2 transition hover:decoration-current">
                {displayDate}
              </span>
            </span>
          </div>
          <h1>{post.title}</h1>

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

function PostContentSkeleton() {
  return (
    <div className="prose space-y-8 py-8">
      <div className="skeleton h-8 w-40"></div>
      <div className="skeleton h-10 w-4/5"></div>
      <div className="skeleton h-100 w-full"></div>
    </div>
  );
}
