const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = require("./user.model");
const packageSchema = require("./package.model");

const schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: { type: Number },
  comment: { type: String },
  paid: { type: Boolean, default: false },
  billDate: { type: Date, default: Date.now },
});

schema.virtual("hasPaid").get(function () {
  return !!this.paid;
});

schema.virtual("getBillMonthAndYear").get(function () {
  //convert date to mm/yy
  return "";
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
  },
});

module.exports = mongoose.model("UserAccount", schema);
