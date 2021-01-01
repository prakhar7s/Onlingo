
  useEffect(() => {
    //ref
    const collectionRef = projectFirestore.ref("like");

    const likedAt = new Date();

    collectionRef.add({
      likedOf,
      likedBy,
      likedAt,
    });
  }, [likedOf, likedBy]);

  return <div></div>;
};

export default FirebaseLike;
