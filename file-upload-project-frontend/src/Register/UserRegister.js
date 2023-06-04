import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    // console.log(selectedFile);
    console.log("Now lets see formData");
    console.log(formData.get("file"));
    axios
      .post("http://localhost:5000/user/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("User registerd :" + JSON.stringify(response));
        alert("User is registerd successfully , now please login");
        navigate("/user/login");
      })
      .catch((err) => {
        console.log("error will registering user :" + err);
      });
  };

  return (
    <div>
      <h2>Register As User</h2>
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <label>Upload your certificate here</label>
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default UserRegister;
