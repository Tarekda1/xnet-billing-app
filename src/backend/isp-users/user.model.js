const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  userName: { type: String },
  password: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  created: { type: Date, default: Date.now },
  updated: Date,
  isDeleted: { type: Boolean, default: false },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
});

schema.virtual("isUserActive").get(function () {
  return !!this.isActive;
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

module.exports = mongoose.model("User", schema);
