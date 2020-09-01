const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
	Account: require('accounts/account.model'),
	RefreshToken: require('accounts/refresh-token.model'),
	User: require('isp-users/user.model'),
	Package: require('isp-users/package.model'),
	Userpackage: require('isp-users/userpackage.model'),
	isValidId
};

function isValidId(id) {
	return mongoose.Types.ObjectId.isValid(id);
}
