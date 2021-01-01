import React, { useEffect, useState } from "react";
import "./Home.css";
import LeftSection from "./LeftSection/LeftSection";
import MiddleSection from "./MiddleSection/MiddleSection";
import { projectFirestore } from "../../firebase/config";

function useName(username) {
  const [name, setName] = useState("");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .onSnapshot((doc) => {
        if (doc.exists) {
          setName(doc.data().name);
        }
      });

    return () => unsub();
  }, []);

  return name;
}

function useFriendsCount(username) {
  const [friendsCount, setFriendsCounts] = useState("");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("friends")
      .onSnapshot((docs) => {
        if (docs.size) {
          setFriendsCounts(docs.size);
        } else {
          setFriendsCounts("no");
        }
      });

    return () => unsub();
  }, []);

  return friendsCount;
}

function useLikesCount(username) {
  const [likesCount, setLikesCount] = useState("");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("likes")
      .onSnapshot((docs) => {
        if (docs.size) {
          setLikesCount(docs.size);
        } else {
          setLikesCount("no");
        }
      });

    return () => unsub();
  }, []);

  return likesCount;
}

function usePostsCount(username) {
  const [postsCount, setPostsCount] = useState("");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("posts")
      .onSnapshot((docs) => {
        if (docs.size == 0) {
          setPostsCount("no");
        } else {
          setPostsCount(docs.size);
        }
      });

    return () => unsub();
  }, []);

  return postsCount;
}

const Home = ({ username, onRouteChange }) => {
  const userName = useName(username);
  const friendsCount = useFriendsCount(username);
  const postsCount = usePostsCount(username);

  const likesCount = useLikesCount(username);

  const [homeRoute, setHomeRoute] = useState("home");

  return (
    <div className="home">
      <div className="sections">
        <LeftSection
          userName={userName}
          friendsCount={friendsCount}
          likesCount={likesCount}
          postsCount={postsCount}
          username={username}
          onRouteChange={onRouteChange}
          setHomeRoute={setHomeRoute}
        />
        <MiddleSection username={username} homeRoute={homeRoute} />
      </div>
    </div>
  );
};

export default Home;
