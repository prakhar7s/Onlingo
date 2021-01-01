import React, { useEffect } from "react";
import "./Games.css";
import { hideMainSearchBar } from "../../../../functions/mostUsedFunctions";

const Games = ({ searchE, setDisplayAs }) => {
  hideMainSearchBar(searchE);
  useEffect(() => {
    setDisplayAs("!single");
  }, [setDisplayAs]);

  return (
    <div className="gamesContainer">
      <h1>Games</h1>
    </div>
  );
};

export default Games;
