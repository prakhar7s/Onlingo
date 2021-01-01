import React, { useRef, useState } from "react";
import "./Register.css";
import { auth, projectFirestore } from "../../firebase/config";
import { defaultBio, defaultCover, defaultDP } from "../../mostUsedVariables";

const Register = ({ onRouteChange }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [cpError, setCPError] = useState("");
  const [regRoute, setRegRoute] = useState(true);

  const verify = useRef();
  const signUp = (e) => {
    resetValues();
    const a = checkUsername();
    const b = checkPassword();

    if (a && b) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          verify.current.style.display = "flex";
        })
        .catch((error) => {
          if (error) {
            setEmailError(error.message);
          }
        });
    }
  };

  function resetValues() {
    setEmailError("");
    setUsernameError("");
    setCPError("");
    setPasswordError("");
    setEmailError("");
  }

  function checkUsername() {
    if (username === "") {
      setUsernameError("Create username");
      return false;
    } else if (username.length >= 12) {
      setUsernameError("Maximum length of username is 12");
      return false;
    }

    return true;
  }

  function checkPassword() {
    if (password == "") {
      setPasswordError("Create Password");
      return false;
    } else if (password != confirmPassword) {
      setCPError("Password not matched");
      return false;
    }

    return true;
  }

  const stopVerification = () => {
    document.querySelectorAll(".verifyContainer")[0].style.display = "none";
    auth.currentUser.delete();
  };

  const ver = () => {
    auth.currentUser.sendEmailVerification().then(() => {
      window.alert("Please check your mail!");
    });
  };
  // auth.onAuthStateChanged((user) => {
  //   if (user) {
  //     if (user.emailVerified == false) {
  //       console.log("no");

  //       document.querySelectorAll(".verifyContainer")[0].style.display = "flex";
  //     } else {
  //       // saveUserDataToBackend();
  //       console.log("yes");

  //       document.querySelectorAll(".verifyContainer")[0].style.display = "none";
  //     }
  //   }
  // });

  const shiftTheHeading = (e) => {
    e.currentTarget.parentNode.firstChild.style.cssText =
      "top: -20px; font-size:15px";
  };

  const normalHeading = (e) => {
    e.currentTarget.parentNode.firstChild.style.cssText =
      "top: -18px; font-size:16px";
  };

  var disp = "";
  if (regRoute) {
    disp = (
      <>
        <h3
          onClick={() => onRouteChange("FIRST")}
          className="backToMainFromRegister"
        >
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
          <span>Back</span>
        </h3>
        <div className="registerPage__heading">
          <h1>Sign Up</h1>
        </div>
        <div className="registerPage__headingBelow">
          <p>Welcome, Please sign up your account.</p>
        </div>
        <div className="registerPage__body">
          <div className="registerPage__fullName">
            <div className="registerPage__wrapper">
              <div className="registerPage__firstName">
                <h3>First Name</h3>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={(e) => shiftTheHeading(e)}
                  onBlur={(e) => normalHeading(e)}
                  type="text"
                  placeholder={"e.g. John"}
                  autoFocus
                />
              </div>
            </div>

            <div className="registerPage__W registerPage__wrapper">
              <div className="registerPage__lastName">
                <h3>Last Name</h3>
                <input
                  className="registerPage__lastNameInput"
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={(e) => shiftTheHeading(e)}
                  onBlur={(e) => normalHeading(e)}
                  type="text"
                  placeholder={"e.g. Doe"}
                />
              </div>
            </div>
          </div>

          <div className="registerPage__wrapper">
            <div className="registerPage__username">
              <h3>
                Username
                <section style={{ display: "inline", color: "red" }}>*</section>
              </h3>
              <input
                onChange={(e) => setUsername(e.target.value)}
                onFocus={(e) => shiftTheHeading(e)}
                onBlur={(e) => normalHeading(e)}
                type="text"
                placeholder={"e.g. john@bhai"}
                required
              />
              <p className="registerPage__usernameError">{usernameError}</p>
            </div>
          </div>

          <div className="registerPage__wrapper">
            <div className="registerPage__email">
              <h3>Email</h3>
              <input
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => shiftTheHeading(e)}
                onBlur={(e) => normalHeading(e)}
                type="email"
                placeholder={"e.g. johndoe@gmail.com"}
              />
              <p className="registerPage__emailError">{emailError}</p>
            </div>
          </div>
          <div className="registerPage__wrapper">
            <div className="registerPage__password">
              <h3>Password</h3>
              <input
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => shiftTheHeading(e)}
                onBlur={(e) => normalHeading(e)}
                type="password"
                placeholder={"e.g. john1234"}
              />
            </div>
            <p className="registerPage__confirmPasswordError">
              {passwordError}
            </p>
          </div>

          <div className="registerPage__wrapper">
            <div className="registerPage__Confirmpassword">
              <h3>Confirm password</h3>
              <input
                onFocus={(e) => shiftTheHeading(e)}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={(e) => normalHeading(e)}
                type="password"
                placeholder={"e.g. john1234"}
              />
            </div>
            <p className="registerPage__confirmPasswordError">{cpError}</p>
          </div>
          <button className="reg__signin" onClick={(e) => signUp(e)}>
            Sign Up
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="registerPage">
      <div ref={verify} className="verifyContainer">
        <p>Please verify your account.</p>
        <div className="verifyContainer__buttons">
          <button onClick={ver} className="verifyContainer__verifyButton">
            Verfiy Email
          </button>
          <button
            onClick={stopVerification}
            className="verifyContainer__closeButton"
          >
            Cancel Verification
          </button>
          <button
            onClick={() => {
              // console.log(auth.currentUser.emailVerified, auth.currentUser);
              // auth.onAuthStateChanged((user) => {
              //   if (user.emailVerified) {
              projectFirestore
                .collection("users")
                .doc(username)
                .set({
                  bio: defaultBio,
                  coverPic: defaultCover,
                  email: email,
                  name: firstName + " " + lastName,
                  profilePic: defaultDP,
                  username: username,
                  accountCreatedAt: new Date().toString(),
                });
              auth.signOut().then(
                () => console.log("singedout"),
                (err) => console.log(err)
              );
              onRouteChange("SIGN IN");
              //   } else {
              //     if (
              //       window.confirm(
              //         "You haven't verified your email.Do you still want to Sing in"
              //       )
              //     ) {
              //       onRouteChange("SIGN IN");
              //     }
              //   }
              // });
            }}
          >
            Sign In
          </button>
        </div>
      </div>
      {disp}
    </div>
  );
};

export default Register;
