import { useState } from "react";
import { supabase } from "../../supabase-client.js";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      console.log("[error]", error);
    }
    console.log("[data]", data);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("[error]", error);
    }
  };

  const handleGetUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
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
    </div>
  );
}

export default Login;
