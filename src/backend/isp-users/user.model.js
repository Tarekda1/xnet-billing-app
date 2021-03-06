const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String },
  isActive: { type: Boolean, default: true },
  userName: { type: String, required: true },
  password: { type: String, default: "123456" },
  email: { type: String },
  phoneNumber: { type: String, default: "03112233" },
  created: { type: Date, default: Date.now },
  updated: Date,
  isDeleted: { type: Boolean, default: false },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
});

userSchema.index({ firstName: 1, lastName: 1, userName: 1 }, { unique: true });

userSchema.virtual("isUserActive").get(function () {
  return !!this.isActive;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

module.exports = mongoose.model("User", userSchema);
