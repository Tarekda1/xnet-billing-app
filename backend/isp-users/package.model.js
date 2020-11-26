const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	displayName: { type: String, unique: true, required: true },
	created: { type: Date, default: Date.now },
	updated: Date
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

module.exports = mongoose.model('Package', schema);
