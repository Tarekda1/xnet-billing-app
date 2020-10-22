const formatDate = (date, format) => {
	console.log(date);
	const map = {
		mm: date.getMonth() + 1,
		dd: date.getDate(),
		yy: date.getFullYear().toString().slice(-2),
		yyyy: date.getFullYear()
	};

	return format.replace(/mm|dd|yy|yyy/gi, (matched) => map[matched]);
};

const getToken = () => sessionStorage.getItem('token');

export { formatDate, getToken };
