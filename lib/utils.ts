export const convertDataToTime = (data: string) => {
  const date = new Date(data);
  const minutes =
    date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
  const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
  return `${hours}:${minutes}`;
};

export const getUniqId = () => Math.random().toString(16).slice(2);
