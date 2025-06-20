import { useRevalidator } from "react-router";

function PostsError() {
  const revalidator = useRevalidator();
  const revalidateData = () => {
    revalidator.revalidate();
  };
  return (
    <div className="prose mx-auto pt-30 text-center">
      <h1>Failed to load posts.</h1>
      <h1>Please refresh the page.</h1>
      <button className="btn btn-primary" onClick={revalidateData}>
        Refresh
      </button>
    </div>
  );
}

export default PostsError;
