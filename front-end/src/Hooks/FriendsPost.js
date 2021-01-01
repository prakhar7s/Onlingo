import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const FriendsPost = (username) => {
  const [friendPosts, setDocs] = useState([]);

  useEffect(() => {
    console.log("frinds");
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("friends")
      .get()
      .then((snap) => {
        let documents = [];
        snap.forEach((doc) => {
          projectFirestore
            .collection("users")
            .doc(doc.data().username)
            .collection("posts")
            .get()
            .then((snap) => {
              snap.forEach((doc) => {
                documents.push({ ...doc.data(), id: doc.ref });
              });
            });
        });
        debugger;
        setDocs(documents);
      });

    return () => unsub();
  }, []);

  return { friendPosts };
};

export default FriendsPost;
