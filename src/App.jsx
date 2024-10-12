import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import NavScrollExample from "./components/Navbar";
import Singuppage from "./components/Singuppage";
import ForgotPassword from "./components/Forgotpassword";
import ResetPassword from "./components/ResetPassword";
import Home from "./components/Home";
import DataAdd from "./components/DataAdd";
import UserDataShow from "./components/UserDataShow";
import EditUserData from "./components/EditUserData";
import Today from "./components/Today";

function App() {
  return (
    <Router>
      <div>
        <NavScrollExample />

        <Routes>
          <Route path="/signup" element={<Singuppage />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:uid/:token"
            element={<ResetPassword />}
          />
          <Route path="/dataadd" element={<DataAdd />} />
          <Route path="/userdatashow" element={<UserDataShow />} />
          <Route
            path="/edit-user-data/:phone_id/:mobileNumber/:date/:time/:message1/:message"
            element={<EditUserData />}
          />
          <Route path="/today" element={<Today />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
