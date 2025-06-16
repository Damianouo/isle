export const formatDate = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year} / ${month} / ${day}`;
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedHours = hours < 10 ? "0" + hours : hours;

  return `${formattedHours} : ${formattedMinutes}`;
};
