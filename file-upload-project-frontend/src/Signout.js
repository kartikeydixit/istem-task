import React from "react";
import { useNavigate } from "react-router-dom";
const Signout = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem("token");
    alert("signout successfull");
    navigate("/");
  };
  return (
    <div>
      <button onClick={handleSignout}>Sign out</button>
    </div>
  );
};

export default Signout;
