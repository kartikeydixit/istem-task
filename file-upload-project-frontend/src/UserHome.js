import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Components/Card";
import Header from "./Components/Header";
const UserHome = () => {
  const [files, setFiles] = useState([]);
  const [isAuth, setIsAuth] = useState(true);
  const [user, setUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch files on component mount
    fetchFiles();
    fetchUser();
  }, []);

  const fetchFiles = () => {
    axios
      .get("http://localhost:5000/files", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(`response data is here : ${JSON.stringify(response.data)}`);
        setFiles(response.data);
        setIsAuth(true);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/user", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(`response data is here : ${JSON.stringify(response.data)}`);
        setUser(response.data.name);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:5000/files/search",
        { searchQuery: searchQuery },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        setSearchResults(res.data);
        setFiles(res.data);
        console.log(res.data);
      })
      .catch((err) => {});
  };
  return (
    <div>
      <Header name={user} />
      <div className="file-section">
        <h2>Files:</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {files.map((file) => (
          <div key={file._id}>
            {console.log(file)}
            <Card
              title={file.filename}
              author={file.author}
              orgName={file.ownerName}
              downloads={file.downloads}
              id={file._id}
              language={file.language}
            />
          </div>
        ))}
        {/*isAuth === false ? <>You are not authorized</> : <></>*/}
      </div>
    </div>
  );
};

export default UserHome;
