export const convertDataToTime = (data: string) => {
  const date = new Date(data);
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  return `${hours}:${minutes}`;
};

export const getFullDate = (data: string) => {
  const date = new Date(data);
  const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
  const month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const year = date.getFullYear();
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getUniqId = () => Math.random().toString(16).slice(2);
