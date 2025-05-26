import { Link } from "react-router";
import DominusThrax from "../../assets/images/DominusThrax.png";

function Posts() {
  return (
    <div className="">
      <div className="skeleton mb-4 aspect-[3/1] overflow-hidden md:mb-8 md:aspect-[4/1]">
        <img
          src={DominusThrax}
          alt="dthrax"
          className="size-full object-cover object-[length:0_60%] md:object-[length:0_70%]"
        />
      </div>
      <PostsList />
    </div>
  );
}

export default Posts;

const postsData = [
  { id: "postdata1", title: "You got a problem.", author: "Drifter", date: "5/24" },
  { id: "postdata2", title: "Its never easy.", author: "NONAME", date: "5/25" },
  { id: "postdata3", title: "I tried, but I failed.", author: "Drifter", date: "5/26" },
  { id: "postdata4", title: "Miss the love Ive never had.", author: "Drifter", date: "5/27" },
  { id: "postdata5", title: "We are so COOKED.", author: "NONAME", date: "5/28" },
];

function PostsList() {
  return (
    <ul className="menu divide-base-content/30 w-auto divide-y text-base">
      {postsData.map((post) => (
        <li key={post.id}>
          <Link to={`/post/${post.id}`} className="block">
            <h2 className="line-clamp-1 text-2xl font-bold">{post.title}</h2>
            <p className="text-base-content/70 flex items-center gap-2">
              <span>{post.author}</span>
              <span className="bg-base-content/70 size-0.75 rounded-full"></span>
              <span>{post.date}</span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
