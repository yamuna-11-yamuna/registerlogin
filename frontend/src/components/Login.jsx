import React, { useState } from "react";
import "./Login.css";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";

const Login = ({ switchToRegister, onAdminLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
    if (form.password.length < 6) newErrors.password = "Password must be ≥ 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
})
;

    const data = await response.json();

    if (response.ok) {
      setMessage({ text: data.message, type: "success" });
      if (data.admin) onAdminLogin(); // ✅ Redirect to admin dashboard
      else alert("User login successful!");
    } else {
      setMessage({ text: data.message, type: "error" });
    }
  } catch (err) {
    setMessage({ text: "Server error", type: "error" });
  }
};


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <img src={emailIcon} alt="email" className="input-icon" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          </div>
          {errors.email && <small className="error">{errors.email}</small>}

          <div className="input-group">
            <img src={passwordIcon} alt="password" className="input-icon" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          </div>
          {errors.password && <small className="error">{errors.password}</small>}

          <button type="submit">Login</button>
        </form>

        <p onClick={switchToRegister} style={{ color: "blue", cursor: "pointer" }}>Sign-Up</p>
      </div>
    </div>
  );
};

export default Login;
