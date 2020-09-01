const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./user.model');
const packageSchema = require('./package.model');

const schema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	amount: { type: Number },
	comment: { type: String },
	paid: { type: Boolean, default: false }
});

schema.virtual('isVerified').get(function() {
	return !!(this.verified || this.passwordReset);
});

schema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: function(doc, ret) {
		// remove these props when object is serialized
		delete ret._id;
		delete ret.passwordHash;
	}
});

module.exports = mongoose.model('Userpackage', schema);
