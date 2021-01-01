import React from "react";
import useFirestore from "../../../../../Hooks/useFirestore";
import PostIndi from "../PostIndi";

const ShowingFriendsPosts = ({
  displayAs,
  username,
  friendsProfile,
  setNoPosts,
}) => {
  const { docs } = useFirestore(friendsProfile);
  return (
    <>
      {" "}
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
    </>
  );
};

export default ShowingFriendsPosts;
