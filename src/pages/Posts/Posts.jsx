import { Await, Link } from "react-router";
import DominusThrax from "../../assets/images/DominusThrax.png";
import { Suspense } from "react";
import { formatDate } from "../../utils/formatDateTime.js";
import PostsError from "../Error/PostsError.jsx";

function Posts({ loaderData }) {
  const { postsData } = loaderData;
  return (
    <div className="grid grid-rows-[auto_1fr]">
      <div className="skeleton mb-4 aspect-[3/1] overflow-hidden md:mb-8 md:aspect-[4/1]">
        <img
          src={DominusThrax}
          alt="dthrax"
          className="size-full object-cover object-[length:0_60%] md:object-[length:0_70%]"
        />
      </div>
      <Suspense fallback={<PostsListSkeleton />}>
        <Await resolve={postsData} errorElement={<PostsError />}>
          {(postsData) => <PostsList postsData={postsData} />}
        </Await>
      </Suspense>
    </div>
  );
}

export default Posts;

function PostsList({ postsData }) {
  return (
    <ul className="menu divide-base-content/30 w-auto divide-y text-base">
      {postsData.length > 0 ? (
        postsData.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`} className="block">
              <h2 className="line-clamp-1 text-2xl font-bold">{post.title}</h2>
              <div className="text-base-content/70 flex items-center gap-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={post.avatar} alt="avatar" />
                  </div>
                </div>
                <span>{post.author}</span>
                <span className="bg-base-content/70 size-0.75 rounded-full"></span>
                <span>{formatDate(post.created_at)}</span>
              </div>
            </Link>
          </li>
        ))
      ) : (
        <li>
          <p>No Post found</p>
        </li>
      )}
    </ul>
  );
}

function PostsListSkeleton() {
  return (
    <div className="space-y-3 p-2 py-4">
      <div className="skeleton h-16"></div>
      <div className="skeleton h-16 w-4/5"></div>
      <div className="skeleton h-16 w-2/3"></div>
      <div className="skeleton h-16"></div>
      <div className="skeleton h-16 w-4/5"></div>
      <div className="skeleton h-16 w-2/3"></div>
    </div>
  );
}
