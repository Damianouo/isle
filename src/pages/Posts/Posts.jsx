import { Link } from "react-router";
import DominusThrax from "../../assets/images/DominusThrax.png";

function Posts({ loaderData: postsData }) {
  return (
    <div className="">
      <div className="skeleton mb-4 aspect-[3/1] overflow-hidden md:mb-8 md:aspect-[4/1]">
        <img
          src={DominusThrax}
          alt="dthrax"
          className="size-full object-cover object-[length:0_60%] md:object-[length:0_70%]"
        />
      </div>
      <PostsList postsData={postsData} />
    </div>
  );
}

export default Posts;

function PostsList({ postsData }) {
  return (
    <ul className="menu divide-base-content/30 w-auto divide-y text-base">
      {postsData ? (
        postsData.map((post) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`} className="block">
              <h2 className="line-clamp-1 text-2xl font-bold">{post.title}</h2>
              <p className="text-base-content/70 flex items-center gap-2">
                <span>{post.author}</span>
                <span className="bg-base-content/70 size-0.75 rounded-full"></span>
                <span>{post.created_at}</span>
              </p>
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
