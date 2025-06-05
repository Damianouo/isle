import SettingsForm from "./SettingsForm.jsx";
import AboutSettingsCard from "./AboutSettingsCard.jsx";

function Settings() {
  return (
    <div className="grid grid-rows-[auto_1fr] items-start gap-4 pt-6 md:grid-cols-[1fr_auto] md:grid-rows-1">
      <SettingsForm />
      <AboutSettingsCard />
    </div>
  );
}

export default Settings;
