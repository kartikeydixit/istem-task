import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Components/Card";
import Header from "./Components/Header";

const OrgHome = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isAuth, setIsAuth] = useState(true);
  const [language, setLanguage] = useState("");
  const [author, setAuthor] = useState("");
  const [org, setOrg] = useState("");

  useEffect(() => {
    // Fetch files on component mount
    fetchFilesForOrg();
    fetchOrg();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("author", author);
    formData.append("language", language);
    console.log(selectedFile);
    console.log(formData.get("file"));
    axios
      .post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setIsAuth(true);
        console.log(response.data);
        setSelectedFile(null);
        fetchFilesForOrg();
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const fetchFilesForOrg = () => {
    axios
      .get("http://localhost:5000/files/org", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(`response data is here : ${JSON.stringify(response.data)}`);
        setFiles(response.data);
        setLanguage("");
        setAuthor("");
        setSelectedFile(null);
        setIsAuth(true);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const fetchOrg = () => {
    axios
      .get("http://localhost:5000/org", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(`response data is here : ${JSON.stringify(response.data)}`);
        setOrg(response.data.orgName);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };
  return (
    <div>
      <Header name={org} />
      <div className="input-div">
        <h1>Upload File Here</h1>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Author Name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <h2>Files:</h2>
      {files.map((file) => (
        <div key={file._id}>
          {console.log(file)}
          <Card
            title={file.filename}
            author={file.author}
            orgName={file.ownerName}
            downloads={file.downloads}
            language={file.language}
            id={file._id}
          />
        </div>
      ))}
      {isAuth === false ? <>You are not authorized</> : <></>}
    </div>
  );
};

export default OrgHome;
