import React, { useEffect, useState } from "react";
import "./SignIn.css";
import firebase from "firebase";
import { formatDisplayName } from "../../functions/mostUsedFunctions";

import { defaultBio, defaultCover, defaultDP } from "../../mostUsedVariables";
import { auth, googleProvider, projectFirestore } from "../../firebase/config";

const SignIn = ({ onRouteChange }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passVisi, setPassVisi] = useState("password");
  const [errorInSignIn, setErrorInSignIn] = useState("");

  // FORGOT
  const [forgot, setForgot] = useState(false);
  const [forgotMail, setForgotMail] = useState("");
  const [msg, setMsg] = useState("");

  const handleForgetPass = () => {
    if (forgotMail) {
      auth
        .sendPasswordResetEmail(forgotMail)
        .then(() => {
          setMsg("Check your mail!");
        })
        .catch((err) => {
          if (err.code === "auth/user-not-found") {
            setMsg("Please enter an registered email.");
          } else if (err.code === "auth/invalid-email") {
            setMsg("Entered email address is badly formatted.");
          }
        });
    } else {
      setMsg("You haven't entered any email address.");
    }
  };

  const handleBackToSignButton = () => {
    setEmail("");
    setPassword("");
    setMsg("");
    setForgotMail("");
    setForgot(false);
  };

  const googleAuth = () => {
    setErrorInSignIn("");
    auth
      .signInWithPopup(googleProvider)
      .then((result) => {
        projectFirestore
          .collection("users")
          .where("email", "==", result.user.email)
          .get()
          .then((docs) => {
            if (docs.size == 0) {
              const doc =
                result.user.displayName.split(" ")[0].toLowerCase() +
                Math.random().toString().substring(2, 5);
              projectFirestore
                .collection("users")
                .doc(doc)
                .set({
                  bio: defaultBio,
                  coverPic: defaultCover,
                  email: result.user.email,
                  name: formatDisplayName(result.user.displayName),
                  profilePic: defaultDP,
                  username: doc,
                });
              onRouteChange("HOME", "", doc);
            } else {
              // debugger;
              onRouteChange("HOME", "", docs.docs[0].data().username);
              console.log("old");
            }
          });
      })
      .catch((err) => {
        if (err.code == "auth/popup-closed-by-user") {
          setErrorInSignIn("The popup has been closed by you!");
        } else {
          setErrorInSignIn(
            "A netowrk error has occured.Check internet connection."
          );
        }
      });
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = async () => {
    setErrorInSignIn("");
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        projectFirestore
          .collection("users")
          .where("email", "==", email)
          .get()
          .then((docs) => {
            if (docs.size == 0) {
              setErrorInSignIn("Incorrect email or password.");
            } else {
              onRouteChange("HOME", "", docs.docs[0].data().username);
            }
          });
      })
      .catch((err) => {
        if (err.code === "auth/user-not-found") {
          setErrorInSignIn("Please enter an registered email.");
        } else if (err.code === "auth/invalid-email") {
          setErrorInSignIn("Entered email address is badly formatted.");
        } else {
          setErrorInSignIn(err.message);
        }
      });
  };

  return (
    <div className="signin">
      {/* FORGOT */}
      {forgot && (
        <div className="forgotPassword">
          <button
            onClick={handleBackToSignButton}
            className="backToSigInButton"
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
            <span>Back</span>
          </button>
          <h1>Reset Password</h1>
          <div className="forgotPasswordInput">
            <p>Please enter your email :</p>
            <input
              onChange={(e) => setForgotMail(e.target.value)}
              type="text"
              placeholder={"e.g. johndoe@gmail.com"}
              autoFocus
            />
            <button onClick={handleForgetPass}>Send email</button>
            <p className="msgAfterClick">{msg}</p>
          </div>
        </div>
      )}
      <h3
        onClick={() => onRouteChange("FIRST")}
        className="backToMainFromSignin"
      >
        {" "}
        <i class="fa fa-chevron-left" aria-hidden="true"></i>
        <span>Back</span>
      </h3>
      <h1 className="title">onlinGo</h1>
      <div className="signin__container">
        <p className="errorInSignIn">{errorInSignIn}</p>

        <h1 className="singinText">Signin to your account</h1>
        <div className="signin__emailInput">
          <input
            autoComplete="false"
            placeholder={"e.g. johndoe@gmail.com"}
            className="signin__input"
            onChange={handleEmail}
            type="text"
          />
        </div>
        <div className="signin__passwordInput">
          <input
            className="signin__input"
            placeholder={"e.g. john123"}
            onChange={handlePassword}
            type={passVisi}
          />
          <button
            className="passVisi"
            onClick={() =>
              setPassVisi(passVisi == "text" ? "password" : "text")
            }
          >
            {passVisi == "password" ? (
              <i class="fa fa-eye" aria-hidden="true"></i>
            ) : (
              <i class="fa fa-eye-slash" aria-hidden="true"></i>
            )}
          </button>
        </div>
        <button
          className="forgotPasswordSignin"
          onClick={() => setForgot(true)}
        >
          Forgotten password?
        </button>
        <div>
          <div className="signin__buttons">
            <button className="signin__btn" onClick={onSubmit}>
              Sign In
            </button>
            <h2>OR</h2>
            <button onClick={googleAuth}>Signin with Google</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
