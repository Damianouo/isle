import Accordion from "../../components/Accordion.jsx";

function AboutSettingsCard() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-fit border p-4 md:w-xs lg:w-sm">
      <legend className="fieldset-legend">About Settings</legend>
      <Accordion groupName="postPreferencesAccordion">
        <h2>Save your preferences</h2>
        <p>They would be type-in automatically when you creating a post.</p>
        <p>The data would be stored solely in your browser.</p>
      </Accordion>
      <Accordion groupName="logoutAccordion">
        <h2>Log out</h2>
        <p>You will not be able to log in with the same identity again.</p>
        <p>
          This means you will no longer be able to edit your posts since we can't verify if the
          editor is the original author.
        </p>
        <p>
          You would have to sing-in anonymously again -- with a new identity -- to create posts.
        </p>
      </Accordion>
    </fieldset>
  );
}
export default AboutSettingsCard;
