<<<<<<< HEAD
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
=======
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
>>>>>>> 1e59d521d95e2963f38720f5b1509d18194af5f3
       mongoose.model("User", UserSchema);