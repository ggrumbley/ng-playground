const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  created_by: { type: Schema.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  text: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

mongoose.model("Post", postSchema);
mongoose.model("User", userSchema);
