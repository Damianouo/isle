import { Link } from "react-router";

function RootError() {
  return (
    <div className="prose mx-auto h-screen pt-[30vh] text-center">
      <h1>404 - Page Now Found</h1>
      <p>The page you're looking for no longer exists.</p>
      <Link to="/" className="btn btn-primary">
        Go Back to Home
      </Link>
    </div>
  );
}

export default RootError;
