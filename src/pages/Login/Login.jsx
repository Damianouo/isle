import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import { supabase } from "../../supabase-client.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useSession } from "../../contexts/SessionContext.jsx";

function Login() {
  const { session } = useSession();
  const [captchaToken, setCaptchaToken] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInAnonymously({ options: { captchaToken } });
    if (error) {
      toast.error("Failed to login, please try again later");
      console.error("[Sign in anonymously]", error);
    } else {
      console.log(data.user);
      toast.success("Login successfully");
      navigate("/settings", { replace: true });
    }
  };

  const handleAccordionClick = () => {
    inputRef.current.checked = !inputRef.current.checked;
  };

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box mx-auto w-full max-w-180 gap-12 border p-8">
      <legend className="fieldset-legend text-4xl">Login</legend>
      <div className="collapse-arrow bg-base-100 border-base-300 collapse border">
        <input type="radio" name="my-accordion-2" ref={inputRef} className="pointer-events-none" />
        <div className="collapse-title text-2xl font-semibold" onClick={handleAccordionClick}>
          To create posts, all users must log in anonymously.
        </div>
        <div className="prose collapse-content text-base-content">
          <p>
            This design allows us to verify if an editor is the original author, while ensuring that
            we do not store any personal information about you in our database.
          </p>
          <p>
            Your identity will be stored solely within the browser you are currently using.
            Consequently, please understand that you will not be able to log in with the same
            identity across different browsers or devices. Furthermore, should you clear your
            browser data or actively log out, this identity will be permanently lost.
          </p>
          <p>
            This is a necessary limitation to provide an uncompromisingly anonymous experience.
            Thank you for your understanding.
          </p>
        </div>
      </div>

      <Turnstile
        className="mx-auto"
        siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY}
        onSuccess={(token) => {
          setCaptchaToken(token);
        }}
      />

      {session ? (
        <p className="text-3xl font-bold">You have logged in anonymously</p>
      ) : (
        <button className="btn btn-xl btn-primary mx-auto px-12" onClick={handleLogin}>
          Login Anonymously
        </button>
      )}
    </fieldset>
  );
}

export default Login;
