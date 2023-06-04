import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Components/Card";
import "bootstrap/dist/css/bootstrap.css"; // Import the Bootstrap CSS file
import Header from "./Components/Header";
const AdminHome = () => {
  const [files, setFiles] = useState([]);
  const [isAuth, setIsAuth] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const [admin, setAdmin] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch files on component mount
    fetchFiles();
    fetchOrg();
    fetchAdmin();
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

  const fetchOrg = () => {
    axios
      .get("http://localhost:5000/orgs", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setOrgs(res.data);
        setIsAuth(true);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const handleUserApproval = (id) => {
    axios
      .get(`http://localhost:5000/users/approve/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        fetchFiles();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleApproval = (id) => {
    axios
      .get(`http://localhost:5000/orgs/approve/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        fetchFiles();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchAdmin = () => {
    axios
      .get("http://localhost:5000/admin", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(`response data is here : ${JSON.stringify(response.data)}`);
        setAdmin(response.data.name);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/users", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        setIsAuth(true);
      })
      .catch((error) => {
        setIsAuth(false);
        console.error(error);
      });
  };

  const handleCertificateView = (id) => {
    axios
      .get(`http://localhost:5000/user/certificate/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      <Header name={admin} />
      <div className="file-section">
        <h2>Files:</h2>
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

      <div className="org-section">
        <h2>Orgs</h2>
        {orgs.map((org) => (
          <div
            key={org._id}
            className="card"
            style={{ width: "24rem", margin: "3rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">{org.orgName}</h5>
              <h6>{org.email}</h6>
              {org.isApproved === true ? (
                <p>Status - Approved by the admin</p>
              ) : (
                <div>
                  <p>Status - Not Approved</p>
                  <a
                    href=""
                    className="btn btn-danger"
                    onClick={() => handleApproval(org._id)}
                  >
                    Approve
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="user-section">
        <h2>Users</h2>
        {users.map((user) => (
          <div
            key={user._id}
            className="card"
            style={{ width: "24rem", margin: "3rem" }}
          >
            <div className="card-body">
              <h5 className="card-title">{user.name}</h5>
              <h6>{user.email}</h6>
              <br />
              <a
                href=""
                className="btn btn-secondary"
                onClick={() => handleCertificateView(user._id)}
              >
                Download Certificate
              </a>
              <br />
              {user.isApproved === true ? (
                <p>Status - Approved by the admin</p>
              ) : (
                <div>
                  <p>Status - Not Approved</p>
                  <a
                    href=""
                    className="btn btn-danger"
                    onClick={() => handleUserApproval(user._id)}
                  >
                    Approve
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHome;
