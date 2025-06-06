import Accordion from "../../components/UI/Accordion.jsx";
import { Link } from "react-router";

function AboutCreatePostCard() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-fit border p-4 md:w-xs lg:w-sm">
      <legend className="fieldset-legend">About Create Post</legend>
      <Accordion groupName="allMessagesAreWelcomedAccordion">
        <h2>All messages are welcomed!</h2>
        <p>I would love to hear any thoughts in your mind.</p>
        <p>If you have questions, please feel free to ask.</p>
        <p>NSFW contents would be deleted</p>
      </Accordion>
      <Accordion groupName="noPersonalInfoAccordion">
        <h2>No personal information</h2>
        <p>You are never obligated to provide any sort of personal information.</p>
        <p>But if you are willing to, I would love to know who you are.</p>
      </Accordion>
      <Accordion groupName="privataPostAccordion">
        <h2>Private Post</h2>
        <p>
          Private posts are only visible to you and <b>Drifter</b>.
        </p>
      </Accordion>
      <Accordion groupName="postContentAccordion">
        <h2>You won't lose the unfinished post</h2>
        <p>
          All text withing <b>Title</b> and <b>Content</b> would be saved in your browser
          automatically.
        </p>
      </Accordion>
      <Accordion groupName="postAuthorAccordion">
        <h2>Save your preferences</h2>
        <p>
          You can save the preferred <b>Name</b> and <b>Avatar</b> in{" "}
          <Link to="/settings" className="link link-secondary transition-colors">
            Settings
          </Link>
        </p>
        <p>They would be type-in automatically when you are creating a post.</p>
      </Accordion>
    </fieldset>
  );
}

export default AboutCreatePostCard;
