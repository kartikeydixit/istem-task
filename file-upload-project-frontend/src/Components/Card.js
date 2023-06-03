import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css"; // Import the Bootstrap CSS file
import axios from "axios";

const Card = (props) => {
  const handleDownload = (id) => {
    axios
      .get(`http://localhost:5000/download/files/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(`response data is here : ${JSON.stringify(response.data)}`);
        alert("downloaded succesfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <div className="card" style={{ width: "24rem", margin: "3rem" }}>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <h6>Author - {props.author}</h6>
          <h6>Provided by - {props.orgName}</h6>
          <p>Downloads - {props.downloads}</p>
          <p>Language - {props.language}</p>
          <a
            href=""
            onClick={() => handleDownload(props.id)}
            className="btn btn-primary"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
