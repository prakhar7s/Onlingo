import React from "react";
import "./First.css";

const First = ({ onRouteChange }) => {
  return (
    <div className="first">
      <header>
        <button
          className="btn"
          onClick={() => {
            onRouteChange("SIGN IN");
          }}
        >
          Sign in
        </button>
        <button
          className="btn"
          onClick={() => {
            onRouteChange("REGISTER");
          }}
        >
          Sign up
        </button>
      </header>
      <h1 className="first__appName">onlinGo</h1>
      <div className="about_onlingo">
        onlinGo helps you connect and share with the people in your life.
      </div>
      <div className="clickMe_register">
        <span>Don't have an account?</span>
        <button
          className="btn"
          onClick={() => {
            onRouteChange("REGISTER");
          }}
        >
          Open Account
        </button>
      </div>
    </div>
  );
};

export default First;
