import AvatarDropdown from "./AvatarDropdown.jsx";
import { usePostPreferences } from "../../contexts/PostPreferencesContext.jsx";

function Settings() {
  const { postPreferences, setPostPreferences } = usePostPreferences();
  const handleChange = ({ target }) => {
    setPostPreferences({
      ...postPreferences,
      [target.name]: target.value,
    });
  };
  return (
    <div>
      <h1 className="my-6 text-4xl font-bold">Settings</h1>
      <div className="space-y-8 px-4">
        {/*Name*/}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Preferred Name</legend>
          <input
            type="text"
            className="input"
            placeholder="Enter Name"
            name="name"
            value={postPreferences.name}
            onChange={handleChange}
          />
        </fieldset>
        {/*Avatar*/}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Avatar</legend>
          <div className="flex items-center gap-4">
            <AvatarDropdown
              postPreferences={postPreferences}
              setPostPreferences={setPostPreferences}
            />
          </div>
        </fieldset>
        <div className="mt-24 space-y-4">
          <h2 className="text-2xl font-bold">Danger Zone</h2>
          <p>Permanently delete the identity you used before.</p>
          <p>You will have to sign-in anonymously again to use Isle.</p>
          <button className="btn btn-error brightness-50">Delete Identity</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
