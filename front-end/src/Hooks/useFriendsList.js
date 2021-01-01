import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

function useFriendsList(username) {
  const [friendsList, setFriendsList] = useState([]);
  useEffect(() => {
    const unsub = projectFirestore
      .collection("users")
      .doc(username)
      .collection("friends")
      .onSnapshot((docs) => {
        const friends = docs.docs.map((friend) => ({ ...friend.data() }));
        setFriendsList(friends);
      });

    return () => unsub();
  }, []);

  return friendsList;
}

export default useFriendsList;
