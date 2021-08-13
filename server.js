const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// // const knex = require("knex")({
// //   client: "pg",
// //   connection: {
// //     host: "localhost",
// //     user: "postgres",
// //     password: "postgres",
// //     database: "postgres",
// //   },
// // });

// // 2 Databases
// // A. user_logins
// // B. user_lastSeens

// // knex
// //   .raw(
// //     "CREATE TABLE User_Logins( loginID varchar(50) PRIMARY KEY,username varchar(20), loginDate date, loginAt time)"
// //   )
// //   .then((res) => console.log(res));

// // const loginat = "12:12:12";

// // knex
// //   .raw(
// //     `INSERT INTO user_logins(loginid, username, logindate, loginat) VALUES('dsadad', 'sdad', '12/2/2000'::date, '${loginat}'::time)`
// //   )
// //   .then((res) => console.log(res));

// // knex.raw("SELECT * FROM user_logins").then((data) => console.log(data.rows));

const app = express();

const PORT = process.env.PORT || 3002;

// // knex.raw("SELECT * FROM user_logins").then((data) => console.log(data.rows));

// // knex.raw("DELETE FROM user_logins").then((res) => console.log(res));

// // knex
// //   .raw(
// //     "CREATE TABLE user_lastseens( loginid varchar(50), lastseen time, foreign key (loginid) references user_logins(loginid) )"
// //   )
// //   .then((res) => console.log(res));

// // knex.raw("DROP TABLE user_lastseens").then((res) => console.log(res));

// app.use(cors());
// app.use(express.json());

// // knex.raw("SELECT * FROM user_logins").then((data) => console.log(data.rows));
// // knex.raw("SELECT * FROM user_lastseens").then((data) => console.log(data.rows));

// app.post("/loginSession", async (req, res) => {
//   const { loginid, username, logindate, loginat } = req.body;
//   // console.log(req.body);
//   await knex
//     .raw(
//       `INSERT INTO user_logins(loginid, username, logindate, loginat) VALUES('${loginid}', '${username}',  '${logindate}'::date, '${loginat}'::time)`
//     )
//     .then((res) => {});
//   await knex
//     .raw(`INSERT INTO user_lastseens VALUES('${loginid}', '${loginat}'::time)`)
//     .then((res) => {});
//   knex
//     .raw("SELECT * FROM user_logins ORDER BY logindate DESC")
//     .then((data) => {});
//   knex.raw("SELECT * FROM user_lastseens").then((data) => {});

//   res.json("login session created");
// });

// // knex.raw("DELETE FROM user_lastseens").then((res) => {
// //   console.log(res.command);
// // });
// // knex.raw("DELETE FROM user_logins").then((res) => console.log(res.command));

// knex
//   .raw(
//     `SELECT *  FROM user_logins WHERE username='prakhar960' and logindate::date = date '2020-12-12'`
//   )
//   // 2020-12-12T18:30:00.000Z
//   .then((res) => {
//     // console.log(res.rows[0].loginat);
//     // const x = res.rows[0].loginat;
//     // knex
//     //   .raw(
//     //     `SELECT * FROM user_lastseens WHERE loginid = '${res.rows[0].loginid}'`
//     //   )
//     //   .then((res) =>
//     //     // console.log(
//     //     //   res.rows[0].lastseen,
//     //     //   new Date(new Date().toString().substring(0, 16) + x).toTimeString(),
//     //     //   new Date(new Date().toString().substring(0, 16) + x)  -
//     //     //     new Date(
//     //     //       new Date().toString().substring(0, 16) + res.rows[0].lastseen
//     //     //     )
//     //     // )
//     //     getNoOfMins(x, res.rows[0].lastseen)
//     //   );

//     if (res.rows.length) {
//       res.rows.map((row) => {
//         const loginid = row.loginid;
//         const loginat = row.loginat;

//         knex
//           .raw(`SELECT * FROM user_lastseens WHERE loginid = '${loginid}'`)
//           .then((res) => {
//             const lastseen = res.rows[0].lastseen;
//             getNoOfMins(loginat, lastseen);
//           });
//       });
//     }
//   });

// // knex
// //   .raw(
// //     `SELECT loginat, lastseen from user_lastseens INNER JOIN user_logins ON user_lastseens.loginid = user_logins.loginid WHERE username='prakhar960' and logindate::date = date '${new Date().toLocaleDateString()}'`
// //   )
// //   .then((res) => {
// //     const x = res.rows.reduce(
// //       (x, { loginat, lastseen }) => getNoOfMins(loginat, lastseen) + x,
// //       0
// //     );

// //     console.log(x);
// //   });

// app.post("/lastSeen", (req, res) => {
//   // console.log(formatDateAndTime(req.body.loggedAt));
//   const { loginid, lastseen } = req.body;
//   // console.log(req.body);
//   knex
//     .raw(
//       `UPDATE user_lastseens SET lastseen='${lastseen}'::time WHERE loginid='${loginid}'`
//     )
//     .then((res) => {});
//   knex.raw("SELECT * FROM user_lastseens").then((res) => {});
//   res.json("lastseen updated!");
// });

// app.post("/youractivity", async (req, res) => {
//   const ans = [];
//   const { username, noOfDays } = req.body;
//   var dayBefore = 0;
//   while (dayBefore < noOfDays) {
//     new Date();
//     await getUserActivity(username, dayBefore).then((res) => {
//       ans.push(res);
//     });
//     dayBefore++;
//   }

//   res.send(ans);
//   // console.log(ans);
// });

// var ans = "";

// const getUserActivity = async (username, dayBefore) => {
//   const date = new Date(
//     new Date().getTime() - dayBefore * 24 * 60 * 60 * 1000
//   ).toLocaleDateString();
//   return knex
//     .raw(
//       `SELECT user_logins.loginid,user_logins.loginat, user_lastseens.lastseen FROM user_logins INNER JOIN user_lastseens ON user_logins.loginid = user_lastseens.loginid WHERE username = '${username}' and logindate::date = '${date}'`
//     )
//     .then(async ({ rows }) => {
//       if (!rows.length) return [date, 0];

//       // rows.map((row) => console.log(row.loginid));

//       const x = rows.reduce(
//         (accumalativeSum, { lastseen, loginat }) =>
//           accumalativeSum + getNoOfMins(loginat, lastseen),
//         0
//       );

//       return [date, x];
//     });
// };

// // knex
// //   .raw("DELETE FROM user_logins WHERE loginid = 'prakhar531003278450876641248'")
// //   .then((res) => console.log(res.command))
// //   .catch((err) => console.log(err.message));

// // knex
// //   .raw("CREATE TABLE Activity(dateNow date PRIMARY KEY, timeNow time)")
// //   .then((res) => console.log(res));

// // knex
// //   .raw(
// //     `INSERT INTO Activity(dateNow, timeNow) VALUES('12/2/2101'::date, '12:23:21'::time)`
// //   )
// //   .then((res) => console.log(res));

// // knex.raw("SELECT * FROM Activity").then((data) => console.log(data.rows));
// // const x = 2017;
// // knex
// //   .raw(`INSERT INTO User_Activity VALUES('11/11/${x}'::date)`)
// //   .then((res) => console.log());

// // knex.raw("DROP TABLE User_Activity").then((res) => console.log(res));

app.listen(PORT, () => console.log(`server is running at port ${PORT}`));

// // utility functions
// // function formatDateAndTime(d) {
// //   return { date: d.substring(0, 10), time: d.substring(12) };
// // }

// app.post("/userlastseen", async (req, res) => {
//   const { username } = req.body;

//   // knex
//   //   .raw(
//   //     `SELECT * FROM user_logins INNER JOIN user_lastseens ON user_logins.loginid = user_lastseens.loginid WHERE username='${username}' ORDER BY loginat DESC, logindate DESC LIMIT 1`
//   //   )
//   //   .then((r) => {
//   //     res.send([r.rows[0].logindate, r.rows[0].lastseen]);
//   //   });

//   await knex
//     .raw(
//       //   `SELECT username  FROM user_lastseens INNER JOIN user_logins ON user_lastseens.loginid = user_logins.loginid GROUP BY username HAVING username = 'prakhar960'`
//       // )
//       `SELECT * FROM user_logins INNER JOIN user_lastseens ON user_logins.loginid = user_lastseens.loginid WHERE username='${username}' `
//     )
//     .then((d) => {
//       var data = [];

//       d.rows.map((row) => {
//         data.push(
//           new Date(
//             new Date(row.logindate)
//               .toLocaleString()
//               .substring(0, 10)
//               .split("/")
//               .reverse()
//               .join("/") +
//               ", " +
//               row.lastseen
//           )
//         );
//       });
//       const ans = data.sort((d1, d2) => d2 - d1)[0];
//       // console.log(ans.toLocaleString());
//       const sp = ans.toString().split(",");
//       const lastseen = sp[0].split("/").reverse().join("/") + sp[1];

//       // console.log(
//       //   new Date() - lastseen,

//       //   new Date(lastseen.substring(0, 24)),
//       //   lastseen.substring(0, 24)
//       // );

//       if (new Date() - new Date(lastseen.substring(0, 24)) < 5000) {
//         res.json({ lastseen: "Online" });
//       } else {
//         res.json({
//           lastseen: ans.toLocaleString(),
//         });
//       }
//     })
//     .catch((error) => console.log(error.message));
// });

// // knex
// //   .raw(
// //     `select * from user_logins WHERE username = 'prakhar531' ORDER BY logindate DESC, loginat DESC LIMIT 1`
// //   )
// //   .then((r) => {
// //     console.log(r.rows);
// //   });

// // knex
// //   .raw(
// //     //   `SELECT username  FROM user_lastseens INNER JOIN user_logins ON user_lastseens.loginid = user_logins.loginid GROUP BY username HAVING username = 'prakhar960'`
// //     // )
// //     `SELECT * FROM user_logins INNER JOIN user_lastseens ON user_logins.loginid = user_lastseens.loginid WHERE username='${"prakhar531"}'`
// //   )
// //   .then((res) => {
// //     var data = [];

// //     res.rows.map((row) => {
// //       data.push(
// //         new Date(
// //           new Date(row.logindate)
// //             .toLocaleString()
// //             .substring(0, 10)
// //             .split("/")
// //             .reverse()
// //             .join("/") +
// //             ", " +
// //             row.lastseen
// //         )
// //       );
// //     });
// //     const ans = data.sort((d1, d2) => d2 - d1)[0];
// //     console.log(ans.toLocaleString());
// //   })
// //   .catch((error) => console.log(error.message));

// function getNoOfMins(time1, time2) {
//   time2 = new Date(new Date().toString().substring(0, 16) + time2);
//   time1 = new Date(new Date().toString().substring(0, 16) + time1);

//   const miliSecs = time2 - time1;
//   const secs = miliSecs / 1000;
//   var mins = secs * 0.0166667;
//   // console.log(miliSecs, time1, time2, mins);

//   if (mins < 0) {
//     mins = 20;
//   }

//   return mins;
// }

// // knex
// //   .raw(
// //     `SELECT user_logins.loginid,user_logins.loginat, user_lastseens.lastseen FROM user_logins INNER JOIN user_lastseens ON user_logins.loginid = user_lastseens.loginid WHERE username = '${"prakhar531"}' and logindate::date = '${new Date(
// //       new Date().getTime() - 1 * 24 * 60 * 60 * 1000
// //     ).toLocaleDateString()}'`
// //   )
// //   .then((res) => {
// //     const x = res.rows.reduce(
// //       (accumalativeSum, { lastseen, loginat }) =>
// //         accumalativeSum + getNoOfMins(loginat, lastseen),
// //       0
// //     );

// //     console.log(x);
// //   });
