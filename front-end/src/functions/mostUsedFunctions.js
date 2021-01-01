export const hideMainSearchBar = (searchBar) => {
  searchBar.parentNode.parentNode.style.display = "none";
};

export const formatDateAndTime = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var formattedDate = "";

  const givenDate = date.toDate();

  formattedDate =
    days[givenDate.getDay()] +
    ", " +
    months[givenDate.getMonth()] +
    givenDate.toString().substring(7, 16) +
    "at" +
    givenDate.toString().substring(15, 25);

  return formattedDate;
};

export const formatDisplayName = (name) => {
  var formattedName = "";
  name.split(" ").map((word) => {
    formattedName +=
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + " ";
  });
  return formattedName;
};

export function formatLastSeen(time) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  var temp = time.split(",");
  var ndate = temp[0].split("/").reverse().join("/");
  var ntime = temp[1];

  const d = new Date(ndate + "," + ntime);

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = ndate.split("/")[0];

  const ans = [
    `${month} ${day}, ${year}`,
    `${d.toLocaleTimeString().substring(0, 8)}`,
  ];

  return ans;

  // const diff = new Date() - d

  // if(diff > 86400000) {
  //   return d.toLocaleString()
  // }

  // else {
  //   const hours = Math.floor(diff / (1000*60*60))
  //   const mins = Math.floor(  (diff % ( 1000 * 60 * 60 )) / 1000 * 60)
  //   const secs = Math.floor( ((diff % 1000 * 60 * 60) % (1000  *60)) / 1000 )

  //   return `${hours}H ${mins}M ${secs}`
  // }
}
