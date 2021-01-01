import React, { useEffect, useState } from "react";

import { hideMainSearchBar } from "../../functions/mostUsedFunctions";

import "./your-activity.styles.scss";

const YourActivity = ({ searchE, username }) => {
  const [activities, setActivities] = useState([]);
  const [noOfDays, setNoOfDays] = useState(10);
  hideMainSearchBar(searchE);

  function formatTime(time) {
    time = parseInt(time);
    var ans = "";
    if (parseInt(time / 60) > 0) {
      if (time % 60 > 0) {
        ans = `${parseInt(time / 60)}h ${time % 60}m`;
      } else {
        ans = `${parseInt(time / 60)}h `;
      }
    } else {
      if (time === 0) {
        ans = "0 mins";
      } else {
        ans = `${time}m`;
      }
    }
    return ans;
  }

  useEffect(() => {
    fetch("http://localhost:3002/youractivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        noOfDays,
      }),
    })
      .then((response) => response.json())
      .then((activities) => {
        setActivities(activities);
        console.log(activities);
      });
  }, [noOfDays]);

  const maxHeight = 100;

  return (
    <div className="your-activity">
      <div className="title">Your Activity</div>
      <div className="select-no-of-days">
        <p>Last</p>
        <select onChange={(e) => setNoOfDays(parseInt(e.target.value))}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <p>Days</p>
      </div>
      <div className="avg-wrapper">
        <div className="avg-time">
          {Math.floor(
            activities.reduce(
              (accumalativeSum, activity) => accumalativeSum + activity[1],
              0
            ) / noOfDays
          )}
          <span>m</span>
        </div>

        <span className="daily-avg">Daily average</span>
        <p className="daily-avg-para">
          The average time you've spent per day using the onlinGo app in the
          last {noOfDays} days.
        </p>
      </div>
      <div className="bar-container">
        {activities.map((activity) => (
          <div className="bar-wrapper" key={activity[0].toString()}>
            <div
              style={{ height: 40 / (maxHeight / activity[1]) }}
              className="bar"
            ></div>
            <h1>{formatTime(activity[1])}</h1>
            <h2>{activity[0]}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourActivity;
