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
import { postListLoader } from "./loaders/postListLoader.js";
import { postLoader } from "./loaders/postLoader.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts", element: <Posts />, loader: postListLoader },
      { path: "post/:id", element: <Post />, loader: postLoader },
      { path: "privatePosts", element: <Posts /> },
      { path: "submit", element: <Submit /> },
      { path: "settings", element: <Settings /> },
      { path: "login", element: <Login /> },
      { path: "drifter", element: <Drifter /> },
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
