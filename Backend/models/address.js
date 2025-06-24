import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    line1: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    pin: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{6}$/,
      maxlength: 6,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{10}$/,
      maxlength: 10,
    },
  },
  {
    timestamps: true,
  }
);
const Address = mongoose.model("Address", addressSchema);
export default Address;
