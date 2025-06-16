import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./layouts/Root.jsx";
import Home from "./pages/Home/Home.jsx";
import Posts from "./pages/Posts/Posts.jsx";
import Post from "./pages/Post/Post.jsx";
import Submit from "./pages/Submit/Submit.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Login from "./pages/Login/Login.jsx";
import Drifter from "./pages/Drifter/Drifter.jsx";
import SessionProvider from "./contexts/SessionContext.jsx";
import PostPreferencesProvider from "./contexts/PostPreferencesContext.jsx";
import { defineLazyRoute } from "./utils/defineLazyRoute.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        lazy: defineLazyRoute(import("./pages/Home/Home.jsx")),
        handle: { Component: Home },
      },
      {
        path: "posts",
        lazy: defineLazyRoute(
          import("./pages/Posts/Posts.jsx"),
          import("./loaders/postListLoader.js"),
        ),
        handle: { Component: Posts },
      },
      {
        path: "post/:id",
        lazy: defineLazyRoute(import("./pages/Post/Post.jsx"), import("./loaders/postLoader.js")),
        handle: { Component: Post },
      },
      {
        path: "privatePosts",
        lazy: defineLazyRoute(
          import("./pages/Posts/Posts.jsx"),
          import("./loaders/postListLoader.js"),
        ),
        handle: { Component: Posts },
      },
      {
        path: "submit",
        lazy: defineLazyRoute(import("./pages/Submit/Submit.jsx")),
        handle: { Component: Submit },
      },
      {
        path: "settings",
        lazy: defineLazyRoute(import("./pages/Settings/Settings.jsx")),
        handle: { Component: Settings },
      },
      {
        path: "login",
        lazy: defineLazyRoute(import("./pages/Login/Login.jsx")),
        handle: { Component: Login },
      },
      {
        path: "drifter",
        lazy: defineLazyRoute(import("./pages/Drifter/Drifter.jsx")),
        handle: { Component: Drifter },
      },
    ],
  },
]);

function App() {
  return (
    <SessionProvider>
      <PostPreferencesProvider>
        <RouterProvider router={router} />
      </PostPreferencesProvider>
    </SessionProvider>
  );
}

export default App;
