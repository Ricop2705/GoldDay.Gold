import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  phone: String,
  password: String,
  createdAt:{
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User ||
       mongoose.model("User", UserSchema);