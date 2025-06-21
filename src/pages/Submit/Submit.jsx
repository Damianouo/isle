import PostForm from "./PostForm.jsx";
import AboutCreatePostCard from "./AboutCreatePostCard.jsx";

function Submit() {
  return (
    <div className="grid grid-rows-[1fr_auto] items-start gap-4 md:grid-cols-[1fr_auto] md:grid-rows-1 md:pt-6">
      <PostForm />
      <AboutCreatePostCard />
    </div>
  );
}

export default Submit;
