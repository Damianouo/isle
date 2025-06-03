import { useState } from "react";
import { supabase } from "../../supabase-client.js";
import { useSession } from "../../contexts/SessionContext.jsx";

function Drifter() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { session } = useSession();
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.log("[error]", error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("[error]", error);
    } else {
      console.log("logged out");
    }
  };

  const handleGetUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      console.log(session.user);
    } else {
      console.log("no session");
    }
  };
  return (
    <div className="flex flex-col items-center pt-32">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend text-3xl">Login</legend>

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button className="btn btn-neutral mt-4" onClick={handleLogin}>
          Login
        </button>
        <button className="btn btn-neutral mt-4" onClick={handleLogout}>
          Logout
        </button>
        <button className="btn btn-neutral mt-4" onClick={handleGetUser}>
          Get User
        </button>
      </fieldset>

      <p>
        <span>id : </span>
        <span>{session?.id || "no id"}</span>
      </p>
      <p>
        <span>email : </span>
        <span>{session?.email || "no email"}</span>
      </p>
      <p>
        <span>is_anonymous : </span>
        <span>{String(session?.is_anonymous)}</span>
      </p>
    </div>
  );
}

export default Drifter;
