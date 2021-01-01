import React from "react";
import "./UserHomePage.css";

import { useEffect, useState } from "react";
import "../../../MiddleSection/ProfileSearch/SpecificProfile/SpecificProfileAllPosts/SpecificProfileAllPosts.css";
import {
  projectFirestore,
  projectStorage,
} from "../../.../../../../../firebase/config";
import SpecificProfileAllPosts from "../../../MiddleSection/ProfileSearch/SpecificProfile/SpecificProfileAllPosts/SpecificProfileAllPosts";
import EditIcon from "@material-ui/icons/Edit";
import { formatDisplayName } from "../../../../../functions/mostUsedFunctions";

const UserHomePage = ({ profile }) => {
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState(0);
  const [friends, setFriends] = useState(0);
  const [likes, setLikes] = useState(0);
  const [profilePic, setProfilePic] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  // edit
  var newName = "";
  var newBio = "";

  const usersRef = projectFirestore.collection("users").doc(profile);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    usersRef.get().then((doc) => {
      setUser(doc.data());
    });
  };

  useEffect(() => {
    //Friends, Likes, Posts
    const ownRef = projectFirestore.collection("users").doc(profile);
    //Friends
    ownRef.collection("friends").onSnapshot((snapshot) => {
      setFriends(snapshot.size);
    });
    //Likes
    ownRef.collection("likes").onSnapshot((snapshot) => {
      setLikes(snapshot.size);
    });
    //Posts
    ownRef.collection("posts").onSnapshot((snapshot) => {
      setPosts(snapshot.size);
    });

    projectFirestore
      .collection("users")
      .doc(profile)
      .onSnapshot((snapshot) => {
        setProfilePic(snapshot.data().profilePic);
      });

    projectFirestore
      .collection("users")
      .doc(profile)
      .onSnapshot((snapshot) => {
        setCoverPic(snapshot.data().coverPic);
      });

    projectFirestore
      .collection("users")
      .doc(profile)
      .onSnapshot((snapshot) => {
        setUsername(snapshot.data().username);
      });

    projectFirestore
      .collection("users")
      .doc(profile)
      .onSnapshot((snapshot) => {
        setBio(snapshot.data().bio);
      });

    projectFirestore
      .collection("users")
      .doc(profile)
      .onSnapshot((snapshot) => {
        setName(snapshot.data().name);
      });
  }, []);

  const changeCover__avatar = (e) => {
    // two steps
    //1. get current cover URL and delete from cloud
    //2. upload new one

    //1.

    projectFirestore
      .collection("users")
      .doc(profile)
      .get()
      .then((doc) => {
        projectStorage
          .refFromURL(doc.data().coverPic)
          .delete()
          .then(() => {
            //deleted
            console.log("Cover deleted");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    //2.
    const file = e.target.files[0];
    //references
    const storageRef = projectStorage
      .ref()
      .child("coverPhotos")
      .child(file.name + Math.random().toString())
      .put(file);
    const collectionRef = projectFirestore.collection("users").doc(profile);

    storageRef.on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        document.querySelectorAll(
          ".userHomePage__uploading"
        )[0].innerHTML = `Changing cover image...   ${parseInt(percentage)}%`;
        console.log("pro,", percentage);
        if (percentage == 0) {
          document.querySelectorAll(
            ".userHomePage__uploading"
          )[0].style.display = "flex";
        }
      },
      (err) => {},
      async () => {
        const url = await storageRef.snapshot.ref.getDownloadURL();

        document.querySelectorAll(".userHomePage__uploading")[0].style.display =
          "none";

        collectionRef.get().then((doc) => {
          doc.ref.update({ coverPic: url });

          // show scroll bar
          document.querySelector(".userspecificProfile").style.overflow =
            "scroll";
          document.querySelector(".userspecificProfile").style.overflowX =
            "hidden";
          // display edit box
          document.querySelector(
            ".userHomePage__editContainer1"
          ).style.display = "none";
        });
      }
    );
  };

  const changeProfile__avatar = (e) => {
    //delete previous DP
    projectFirestore
      .collection("users")
      .doc(profile)
      .get()
      .then((doc) => {
        projectStorage
          .refFromURL(doc.data().profilePic)
          .delete()
          .then(() => {
            console.log("DP deleted");
          })
          .catch((error) => {
            console.log(error);
          });
      });

    const file = e.target.files[0];
    //references
    const storageRef = projectStorage
      .ref()
      .child("profilePhotos")
      .child(file.name + Math.random().toString())
      .put(file);
    const collectionRef = projectFirestore.collection("users").doc(profile);

    storageRef.on(
      "state_changed",
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        document.querySelector(
          ".userHomePage__uploading"
        ).innerHTML = `Changing profile image...   ${parseInt(percentage)}%`;
        if (percentage == 0) {
          document.querySelectorAll(
            ".userHomePage__uploading"
          )[0].style.display = "flex";
        } else if (percentage == 100) {
          // wait for 200ms
          setTimeout(200, () => {
            document.querySelectorAll(
              ".userHomePage__uploading"
            )[0].style.display = "none";
          });
        }
      },
      (err) => {},
      async () => {
        const url = await storageRef.snapshot.ref.getDownloadURL();

        document.querySelectorAll(".userHomePage__uploading")[0].style.display =
          "none";
        collectionRef.get().then((doc) => {
          doc.ref.update({ profilePic: url });
          // show scroll bar
          document.querySelector(".userspecificProfile").style.overflow =
            "scroll";
          document.querySelector(".userspecificProfile").style.overflowX =
            "hidden";
          // display progile box
          document.querySelector(
            ".userHomePage__editContainer1"
          ).style.display = "none";
        });
      }
    );
  };

  const handleChangeInName = () => {
    if (newName !== name) {
      projectFirestore
        .collection("users")
        .doc(profile)
        .get()
        .then((doc) => {
          doc.ref.update({ name: newName });
        });
    }
  };

  function handleChangeInBio() {
    if (bio !== newBio) {
      projectFirestore
        .collection("users")
        .doc(profile)
        .get()
        .then((doc) => {
          doc.ref.update({ bio: newBio });
        });
    }
  }

  return (
    <div className="userHomePage">
      {user && (
        <div className="userspecificProfile">
          {/* edit section */}
          <div className="userHomePage__editContainer1">
            <div className="userHomePage__editContainer">
              <button
                onClick={() => {
                  // show scroll bar
                  document.querySelector(
                    ".userspecificProfile"
                  ).style.overflow = "scroll";
                  document.querySelector(
                    ".userspecificProfile"
                  ).style.overflowX = "hidden";
                  // display progile box
                  document.querySelector(
                    ".userHomePage__editContainer1"
                  ).style.display = "none";
                }}
                className="userHomePage__editContainerCloseButton"
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i>
              </button>
              <h1>Edit profile.... </h1>
              <div className="userHomePage__editContainerImages">
                <div className="userHomePage__editContainerDP">
                  <h1>Current DP</h1>
                  <div className="userHomePage__editContainerDPPreview">
                    <img src={profilePic} alt="DP" />
                  </div>

                  <input
                    className="profileAvatar__input"
                    onChange={(e) => {
                      changeProfile__avatar(e);
                    }}
                    type="file"
                  />
                </div>

                <div className="userHomePage__editContainerCover">
                  <h1>Current Cover</h1>

                  <div className="userHomePage__editContainerCoverPreview">
                    <img src={coverPic} alt="cover photo" />
                  </div>

                  <input
                    type="file"
                    onChange={(e) => {
                      changeCover__avatar(e);
                    }}
                    className="cover__input"
                  />
                </div>
              </div>
              <div className="editProfileNameAndBioContainer">
                <div className="editProfileName">
                  <h2>Name</h2>
                  <div>
                    <input
                      placeholder={name}
                      onChange={(e) => {
                        newName = e.target.value;
                      }}
                      className="editProfileNameTextArea"
                    />
                    <button
                      onClick={handleChangeInName}
                      className="editProfileNameSaveButton"
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="editProfileBio">
                  <h2>Bio</h2>
                  <div>
                    <textarea
                      placeholder={bio}
                      onChange={(e) => {
                        // if()

                        newBio = e.target.value;
                        console.log(e.target.value);
                      }}
                      className="editProfileNameBio"
                    />
                    <button
                      onClick={handleChangeInBio}
                      className="editProfileBioSaveButton"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profileEverthing">
            <div className="cover">
              <img
                src={
                  coverPic ||
                  "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
                }
                alt=""
              />

              <button
                onClick={() => {
                  // hide scroll bar
                  document.querySelector(
                    ".userspecificProfile"
                  ).style.overflow = "hidden";
                  // display edit box
                  document.querySelector(
                    ".userHomePage__editContainer1"
                  ).style.display = "flex";
                }}
                className="userHomeProfile__editButton"
              >
                Edit profile
              </button>
            </div>
            <div className="profileAvatar">
              <img src={profilePic} alt="" />
            </div>
            <div className="profileContent">
              <div className="specificProfile__Name">
                <h2>{formatDisplayName(name)}</h2>

                <div className="publicInformations">
                  <div className="publicInformations__inner">
                    <h1>Friends</h1>
                    <h2>{friends}</h2>
                  </div>
                  <div className="publicInformations__inner">
                    <h1>Posts</h1>
                    <h2>{posts}</h2>
                  </div>
                  <div className="publicInformations__inner">
                    <h1>Likes</h1>
                    <h2>{likes}</h2>
                  </div>
                </div>
              </div>
              <div className="UsernameOf__profile">
                <h2>{`@${username}`}</h2>
              </div>
              <p data-attribute={user.username} className="profileBio">
                {bio || <span className="profileBio__noBio">no bio</span>}
              </p>
              <div className="postHeadline">
                <div className="postHeadline__line"></div>
                <div className="postHeadline__text">
                  <h1>POSTS</h1>
                </div>
                <div className="postHeadline__line"></div>
              </div>
              <div className="specificProfile__allPosts">
                <SpecificProfileAllPosts profile={profile} />
              </div>
            </div>
          </div>

          <div className="userHomePage__uploading"></div>
        </div>
      )}
    </div>
  );
};

export default UserHomePage;
