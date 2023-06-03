import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrgRegister from "./Register/OrgRegister";
import OrgLogin from "./Login/OrgLogin";
import Signout from "./Signout";
import Welcome from "./Welcome";
import AdminResgiter from "./Register/AdminRegister";
import AdminLogin from "./Login/AdminLogin";
import UserRegister from "./Register/UserRegister";
import UserLogin from "./Login/UserLogin";
import AdminHome from "./AdminHome";
import OrgHome from "./OrgHome";
import UserHome from "./UserHome";
import Header from "./Components/Header";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="/org/home" element={<OrgHome />}></Route>
        <Route path="/admin/home" element={<AdminHome />}></Route>
        <Route path="/user/home" element={<UserHome />}></Route>
        <Route path="/org/register" element={<OrgRegister />}></Route>
        <Route path="/org/login" element={<OrgLogin />}></Route>
        <Route path="/admin/register" element={<AdminResgiter />}></Route>
        <Route path="/admin/login" element={<AdminLogin />}></Route>
        <Route path="/user/register" element={<UserRegister />}></Route>
        <Route path="/user/login" element={<UserLogin />}></Route>
        <Route path="/signout" element={<Signout />}></Route>
        <Route path="/header" element={<Header />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
