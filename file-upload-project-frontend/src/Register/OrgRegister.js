import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrgRegister = () => {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const param = {
      orgName: orgName,
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:5000/org/register", param, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Org registerd :" + JSON.stringify(response));
        alert("Your Organization is registerd successfully , now please login");
        navigate("/org/login");
      })
      .catch((err) => {
        console.log("error will registering org :" + err);
      });
  };

  return (
    <div>
      <h2>Register your Organization</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
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

export default OrgRegister;
