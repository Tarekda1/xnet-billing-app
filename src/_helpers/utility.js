import { store } from "react-notifications-component";

const formatDate = (date, format) => {
  console.log(date);
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear(),
  };

  return format.replace(/mm|dd|yy|yyy/gi, (matched) => map[matched]);
};

const getToken = () => sessionStorage.getItem("token");
const clearToken = () => sessionStorage.removeItem("token");

const showNotification = ({ title, message }) => {
  store.addNotification({
    title: title,
    message: message,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true,
    },
  });
};

export { formatDate, getToken, clearToken, showNotification };
