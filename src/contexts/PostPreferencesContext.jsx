import useLocalStorage from "../hooks/useLocalStorage.jsx";
import { createContext, useContext } from "react";

const PostPreferencesContext = createContext(null);
const initialValue = {
  name: "",
  avatar: "",
};

const PostPreferencesProvider = ({ children }) => {
  const [postPreferences, setPostPreferences] = useLocalStorage("postPreferences", initialValue);
  return (
    <PostPreferencesContext.Provider value={{ postPreferences, setPostPreferences }}>
      {children}
    </PostPreferencesContext.Provider>
  );
};

export default PostPreferencesProvider;

export const usePostPreferences = () => {
  const context = useContext(PostPreferencesContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
