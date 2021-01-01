import React, { useEffect, useState } from "react";
import "./SpecificProfile.css";
import { projectFirestore } from "../../../../../firebase/config";
import SpecificProfileAllPosts from "./SpecificProfileAllPosts/SpecificProfileAllPosts";

const SpecificProfile = ({ profile, ownProfile }) => {
  const [user, setUser] = useState("");
  const [status, setStatus] = useState("Add friend");
  const [posts, setPosts] = useState(0);
  const [friends, setFriends] = useState(0);
  const [likes, setLikes] = useState(0);

  const ownUsersRef = projectFirestore
    .collection("users")
    .doc(ownProfile)
    .collection("friend requests");
  const usersRef = projectFirestore.collection("users").doc(profile);

  useEffect(() => {
    console.log("useEffet");
    getUser();
  }, [status]);

  const getUser = () => {
    usersRef.get().then((doc) => {
      setUser(doc.data());
    });
  };

  useEffect(() => {
    //setStatus
    projectFirestore
      .collection("users")
      .doc(ownProfile)
      .collection("friend requests")
      .doc(profile)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          //SEND BY YOUR SIDE
          console.log("your side exists");
          if (snapshot.data().type == "outgoing") {
            if (snapshot.data().status == true) {
              setStatus("Friends");
            } else {
              setStatus("Sent");
            }
          } else {
            projectFirestore
              .collection("users")
              .doc(profile)
              .collection("friend requests")
              .doc(ownProfile)
              .onSnapshot((snap) => {
                if (snap.exists) {
                  if (snap.data().status == true) {
                    setStatus("Friends");
                  } else {
                    setStatus("Accept");
                  }
                } else {
                  setStatus("Friends");
                }
              });
          }
        } else {
          setStatus("Add friend");
        }
      });

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
  }, [status]);

  const handleAddFriend = async (e) => {
    //ADD FRIEND
    if (status === "Add friend") {
      // OUR
      ownUsersRef.doc(profile).set({
        sendedTo: profile,
        status: false,
        type: "outgoing",
      });
      // THERE
      usersRef.collection("friend requests").doc(ownProfile).set({
        sendedBy: ownProfile,
        sendedAt: new Date().toString(),
        type: "incoming",
      });
      setStatus("Sent");
      //NOTIFICATION
      usersRef
        .collection("notifications")
        .doc("ADD" + ownProfile)
        .set({
          type: "friend request",
          who: ownProfile,
          at: new Date().toString(),
        });
    }
    //SENT
    else if (status == "Sent") {
      // OUR
      ownUsersRef
        .doc(profile)
        .get()
        .then((doc) => doc.ref.delete());
      // THERE
      usersRef
        .collection("friend requests")
        .doc(ownProfile)
        .get()
        .then((doc) => doc.ref.delete());
      setStatus("Add friend");
      //NOTIFICATION (DELETE)
      usersRef
        .collection("notifications")
        .doc("ADD" + ownProfile)
        .get()
        .then((doc) => {
          doc.ref.delete();
        });
    } else if (status == "Accept") {
      //updating status
      usersRef
        .collection("friend requests")
        .doc(ownProfile)
        .get()
        .then((doc) => doc.ref.update({ status: true }));

      //adding to friends list
      // OWN
      const ownRef = projectFirestore
        .collection("users")
        .doc(ownProfile)
        .collection("friends")
        .doc(profile);
      // THERE
      const userRef = projectFirestore
        .collection("users")
        .doc(profile)
        .collection("friends")
        .doc(ownProfile);

      ownRef.set({
        username: profile,
        acceptedAt: new Date().toString(),
      });

      userRef.set({
        username: ownProfile,
        acceptedAt: new Date().toString(),
      });
      setStatus("Friends");
      //NOTIFICATION (FRIEDNS) THERE
      usersRef
        .collection("notifications")
        .doc("FRNDS" + ownProfile)
        .set({
          type: "friends",
          who: ownProfile,
          at: new Date().toString(),
        });
      //NOTIFICATION (FRIENDS) OWN
      projectFirestore
        .collection("users")
        .doc(ownProfile)
        .collection("notifications")
        .doc("FRNDS" + profile)
        .set({
          type: "friends",
          who: profile,
          at: new Date().toString(),
        });
    } else if (status == "Friends") {
      // delete chats
      projectFirestore
        .collection("messenging")
        .doc("chats")
        .collection([profile, ownProfile].sort().join("-"))
        .get()
        .then((docs) => {
          if (docs.docs.length) {
            docs.docs.map((doc) => doc.ref.delete());
            console.log("deletef");
          }
        });
      //delete that friend from both the users list
      //own profile
      projectFirestore
        .collection("users")
        .doc(ownProfile)
        .collection("friends")
        .doc(profile)
        .get()
        .then((doc) => doc.ref.delete());
      //that users profile
      projectFirestore
        .collection("users")
        .doc(profile)
        .collection("friends")
        .doc(ownProfile)
        .get()
        .then((doc) => doc.ref.delete());
      // update friend requests
      //from your table
      projectFirestore
        .collection("users")
        .doc(ownProfile)
        .collection("friend requests")
        .doc(profile)
        .get()
        .then((doc) => doc.ref.delete());
      //from their table
      projectFirestore
        .collection("users")
        .doc(profile)
        .collection("friend requests")
        .doc(ownProfile)
        .get()
        .then((doc) => doc.ref.delete());
      setStatus("Add friend");
      //NOTIFICATION (DELETE) OWN ADD
      projectFirestore
        .collection("users")
        .doc(ownProfile)
        .collection("notifications")
        .doc("ADD" + profile)
        .get()
        .then((doc) => {
          if (doc.exists) {
            doc.ref.delete();
          }
        });
      //NOTIFICATION (DELETE) OWN FRNDS
      projectFirestore
        .collection("users")
        .doc(ownProfile)
        .collection("notifications")
        .doc("FRNDS" + profile)
        .get()
        .then((doc) => {
          if (doc.exists) {
            doc.ref.delete();
          }
        });
      //NOTIFICATION (DELETE) THERE ADD
      usersRef
        .collection("notifications")
        .doc("ADD" + ownProfile)
        .get()
        .then((doc) => {
          if (doc.exists) {
            doc.ref.delete();
          }
        });
      //NOTIFICATION (DELETE) THERE FRNDS
      usersRef
        .collection("notifications")
        .doc("FRNDS" + ownProfile)
        .get()
        .then((doc) => {
          if (doc.exists) {
            doc.ref.delete();
          }
        });
    }
  };
  // useEffect(() => {
  //   const s = document.querySelector(".profileBio::after");
  //   console.log(s, s.dataset);
  // }, []);

  return (
    <div>
      {user && (
        <div key={Math.random()} className="specificProfile">
          <div className="profileEverthing">
            {" "}
            <div className="cover">
              <img src={user.coverPic} />
              <button
                onClick={(e) => {
                  handleAddFriend(e);
                }}
                className="addFriends__button"
              >
                {status}
              </button>
            </div>
            <div className="profileAvatar">
              <img src={user.profilePic} alt="" />
            </div>
            <div className="profileContent">
              <div className="specificProfile__Name">
                <h2>{user.name}</h2>
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
                <h2>{`@${user.username}`}</h2>
              </div>
              <p data-attribute={user.username} className="profileBio">
                {user.bio}
              </p>
              <div className="postHeadline">
                <div className="postHeadline__line"></div>
                <div className="postHeadline__text">
                  <h1>POSTS</h1>
                </div>
                <div className="postHeadline__line"></div>
              </div>
              <div className="specificProfile__allPosts">
                <SpecificProfileAllPosts
                  key={Math.random().toString()}
                  key={Math.random().toString()}
                  profile={profile}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecificProfile;
