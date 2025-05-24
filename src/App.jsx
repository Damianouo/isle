import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./layouts/Root.jsx";
import Home from "./pages/Home/Home.jsx";
import Posts from "./pages/Posts/Posts.jsx";
import PrivatePosts from "./pages/PrivatePosts/PrivatePosts.jsx";
import Post from "./pages/Post/Post.jsx";
import Submit from "./pages/Submit/Submit.jsx";
import Settings from "./pages/Settings/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts", element: <Posts /> },
      { path: "posts/:id", element: <Post /> },
      { path: "privatePosts", element: <PrivatePosts /> },
      { path: "privatePosts/:id", element: <Post /> },
      { path: "submit", element: <Submit /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
