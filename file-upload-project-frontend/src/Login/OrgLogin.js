import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const OrgLogin = () => {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const param = {
      orgName: orgName,
      password: password,
    };
    axios
      .post("http://localhost:5000/org/login", param, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Org login :" + JSON.stringify(response));
        localStorage.setItem("token", response.data.token);
        navigate("/org/home");
      })
      .catch((err) => {
        console.log("error will login org :" + err);
      });
  };

  return (
    <div>
      <h2>Login your Organization</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
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

export default OrgLogin;
