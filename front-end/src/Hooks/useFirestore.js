import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

const useFirestore = (username) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("posts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let documents = [];
        snap.forEach((doc) => {
          //own
          documents.push({ ...doc.data(), id: doc.id });
        });
        setDocs(documents);
      });

    return () => unsub();
  }, [username]);

  return { docs };
};

export default useFirestore;
