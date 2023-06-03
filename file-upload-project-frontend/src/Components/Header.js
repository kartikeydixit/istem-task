import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();
  const handleSignout = () => {
    localStorage.removeItem("token");
    alert("signout successfull");
    navigate("/");
  };
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <h3 className="navbar-brand" href="/">
          {props.name}
        </h3>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <a onClick={handleSignout}>Signout</a>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
