import React, { useState } from "react";
import "./Register.css";
import personIcon from "../assets/person.png";
import emailIcon from "../assets/email.png";
import passwordIcon from "../assets/password.png";
import phoneIcon from "../assets/phone.png";

const Register = ({ switchToLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email required";
    if (!form.password || form.password.length < 6) newErrors.password = "Password ≥ 6 chars";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords must match";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setMessage({ text: "Fix errors", type: "error" });
      return;
    }

    const payload = { name: form.name, email: form.email, password: form.password, phone: form.phone };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password, phone }),
})
;
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: data.message, type: "success" });
        setForm({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
        setErrors({});
      } else setMessage({ text: data.message, type: "error" });
    } catch (err) {
      setMessage({ text: "Server error", type: "error" });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <img src={personIcon} alt="person" className="input-icon" />
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          </div>
          {errors.name && <small className="error">{errors.name}</small>}

          <div className="input-group">
            <img src={emailIcon} alt="email" className="input-icon" />
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          </div>
          {errors.email && <small className="error">{errors.email}</small>}

          <div className="input-group">
            <img src={passwordIcon} alt="password" className="input-icon" />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          </div>
          {errors.password && <small className="error">{errors.password}</small>}

          <div className="input-group">
            <img src={passwordIcon} alt="password" className="input-icon" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
          </div>
          {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}

          <div className="input-group">
            <img src={phoneIcon} alt="phone" className="input-icon" />
            <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          </div>
          {errors.phone && <small className="error">{errors.phone}</small>}

          <button type="submit">Sign Up</button>
        </form>

        <p onClick={switchToLogin} style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}>Login</p>
      </div>
    </div>
  );
};

export default Register;
