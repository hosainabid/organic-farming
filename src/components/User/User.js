import React from "react";
import { Link } from "react-router-dom";
import "./User.css";

export default function User() {
  const authState = false;
  return (
    <div className="w-100 bg-light">
      <div className="container">
        <div className="d-flex justify-content-end ">
          <ul className="d-flex userinfo-ul align-items-center">
            <li className="list-btn">
              {authState ? (
                <Link to="/myAccount">My Account</Link>
              ) : (
                <Link to="/login">LogIn/SignUp</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}