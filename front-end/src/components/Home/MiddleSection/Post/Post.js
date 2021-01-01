import React from "react";
import useFirestore from "../../../../Hooks/useFirestore";
import "./Post.css";
import PostIndi from "./PostIndi";

import { useState, useEffect } from "react";
import { projectFirestore } from "../../../../firebase/config";
import ShowingFriendsPosts from "./ShowingFriendsPosts/ShowingFriendsPosts";

//fetching frinds posts
const useFriendsPost = (username) => {
  const [friends, setDocs] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("friends")
      .onSnapshot((snap) => {
        const temp = snap.docs.map((doc) => ({ id: doc.id }));
        setDocs(temp);
      });

    return () => unsub();
  }, []);

  return friends;
};

const Post = ({ username, displayAs, feedAreaRef }) => {
  //regular hook
  const { docs } = useFirestore(username);
  //custom hook
  const friends = useFriendsPost(username);
  const [noPosts, setNoPosts] = useState(true);
  return (
    <>
      {docs && (
        <>
          {docs.map((doc) => (
            <PostIndi
              setNoPosts={setNoPosts}
              id={doc.id}
              key={doc.id}
              displayAs={displayAs}
              username={username}
              doc={doc}
            />
          ))}
        </>
      )}
      {friends &&
        friends.map((frnd) => (
          <ShowingFriendsPosts
            setNoPosts={setNoPosts}
            username={username}
            displayAs={displayAs}
            friendsProfile={frnd.id}
          />
        ))}
      {noPosts && <h1 className="noPostToShow">No posts to show.</h1>}
    </>
  );
};

export default Post;
