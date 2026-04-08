// Formats a date into French: "le lundi 5 janvier 2026"
const convertDate = (date) => {
  const daysOfTheWeek = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  date = new Date(date);
  const day = daysOfTheWeek[date.getDay()];
  const month = months[date.getMonth()];
  return `le ${day} ${date.getDate()} ${month} ${date.getFullYear()}`;
};

export default convertDate;
