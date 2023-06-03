import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./Welcome.css";
import { Link } from "react-router-dom";
const Welcome = () => {
  return (
    <div>
      <ul className="nav">
        <li className="nav-item">
          <Link to="/user/login">Login as User</Link>
        </li>

        <li className="nav-item">
          <Link to="/user/register">Register new User</Link>
        </li>

        <li className="nav-item">
          <Link to="/org/login">Login as Org</Link>
        </li>

        <li className="nav-item">
          <Link to="/org/register">Register new Org</Link>
        </li>
      </ul>

      <div className="content">
        <h3>Welcome to digital library</h3>
        <p>
          Unlike traditional libraries with rows of shelves, a digital library
          offers limitless space for storing and organizing an extensive
          collection of materials. It provides a convenient and efficient means
          of accessing information from the comfort of one's home or office.
          With just a few clicks, users can explore a treasure trove of books,
          journals, articles, photographs, videos, and other valuable resources.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
