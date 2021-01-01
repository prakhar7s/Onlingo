import { projectFirestore } from "../firebase/config";
import { useEffect, useState } from "react";

const useProfile = (username) => {
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .onSnapshot((doc) => {
        setProfile(doc.data());
      });

    return () => unsub();
  }, []);

  return profile;
};

export default useProfile;
