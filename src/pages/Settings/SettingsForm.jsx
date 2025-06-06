import AvatarDropdown from "./AvatarDropdown.jsx";
import { toast } from "react-hot-toast";
import { supabase } from "../../supabase-client.js";
import { useNavigate } from "react-router";
import { usePostPreferences } from "../../contexts/PostPreferencesContext.jsx";

function SettingsForm() {
  const { postPreferences, setPostPreferences } = usePostPreferences();
  const navigate = useNavigate();
  const handleChange = ({ target }) => {
    setPostPreferences({
      ...postPreferences,
      [target.name]: target.value,
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout, please try again later");
    } else {
      toast.success("Logged out successfully");
      localStorage.removeItem("postPreferences");
      localStorage.removeItem("unsavedPostContent");
      navigate("/", { replace: true });
    }
  };

  const handleSelectAvatar = ({ target }) => {
    setPostPreferences((prev) => ({ ...prev, avatar: target.src }));
  };
  return (
    <div>
      <h1 className="mb-6 text-4xl font-bold">Settings</h1>
      <div className="space-y-8 px-4">
        {/*Name*/}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Preferred Name</legend>
          <input
            type="text"
            className="input"
            placeholder="Enter Name"
            name="author"
            value={postPreferences.author}
            onChange={handleChange}
          />
        </fieldset>
        {/*Avatar*/}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Avatar</legend>
          <div className="flex items-center gap-4">
            <AvatarDropdown
              selectedAvatar={postPreferences.avatar}
              handleSelectAvatar={handleSelectAvatar}
            />
          </div>
        </fieldset>
        {/*Danger Zone*/}
        <div className="space-y-4 md:mt-24">
          <h2 className="text-2xl font-bold">Danger Zone</h2>
          <p>Permanently lose your identity.</p>
          <button className="btn btn-error brightness-50" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;
