import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const param = {
      name: name,
      password: password,
    };
    axios
      .post("http://localhost:5000/admin/login", param, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Admin login :" + JSON.stringify(response));
        localStorage.setItem("token", response.data.token);
        navigate("/admin/home");
      })
      .catch((err) => {
        console.log("error will login Admin :" + err);
      });
  };

  return (
    <div>
      <h2>Login As admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
