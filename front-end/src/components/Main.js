import React from "react";
import "./Main.css";
import SignIn from "./SignIn/SignIn";
import Home from "./Home/Home";
import First from "./First/First";
import Register from "./Register/Register";

import { auth, projectFirestore } from "../firebase/config";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      route: "FIRST",
      error: "",
    };
  }

  // componentDidMount() {
  //   auth.onAuthStateChanged((user) => {
  //     console.log(user.email);

  //     if (user) {
  //       projectFirestore
  //         .collection("users")
  //         .where("email", "==", user.email)
  //         .get()
  //         .then((docs) => {
  //           console.log(docs.docs[0].data().username);
  //           if (docs.docs.length) {
  //             this.setState({
  //               username: docs.docs[0].data().username,
  //               route: "HOME",
  //             });
  //           }
  //         });
  //     }
  //   });
  // }

  // componentDidMount() {
  //   auth.onAuthStateChanged((user) => console.log(user));
  // }

  onRouteChange = (route, error, username) => {
    this.setState({ route: route, username: username, error: error });
  };

  render() {
    var show;

    if (this.state.route === "FIRST") {
      show = <First onRouteChange={this.onRouteChange} />;
    } else if (this.state.route === "SIGN IN") {
      show = <SignIn onRouteChange={this.onRouteChange} />;
    } else if (this.state.route === "HOME") {
      show = (
        <Home
          username={this.state.username}
          onRouteChange={this.onRouteChange}
        />
      );
    } else if (this.state.route === "REGISTER") {
      show = <Register onRouteChange={this.onRouteChange} />;
    } else {
      show = <h1>{this.state.error}</h1>;
    }

    return <div>{show}</div>;
  }
}

export default Main;
