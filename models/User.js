import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: function () {
      return this.provider === "credentials";

    },
  },
  
  provider: {
    type: String,
    enum: ["credentials", "github"],
    default: "credentials",
  },

  resetToken: String,

  resetTokenExpiry: Date,

});

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;