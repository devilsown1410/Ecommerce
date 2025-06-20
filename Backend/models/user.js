import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isSeller: {
        type: Boolean,
        default: false,
    },
}, {
  timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;