import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminResgiter = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const param = {
      name: name,
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:5000/admin/register", param, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Admin registerd :" + JSON.stringify(response));
        alert("Admin is registerd successfully , now please login");
        navigate("/admin/login");
      })
      .catch((err) => {
        console.log("error will registering admin :" + err);
      });
  };

  return (
    <div>
      <h2>Register As Admin</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default AdminResgiter;
