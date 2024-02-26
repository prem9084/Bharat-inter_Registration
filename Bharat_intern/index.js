const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

//mongodb connection

const connectDB = async (db) => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URl);
    console.log("Database connected Successfully");
  } catch (error) {
    console.log("Error While Connecting Database");
  }
};
connectDB();

// Scheema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const hashPashword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

module.exports = hashPashword;

const Registration = mongoose.model("users", UserSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// for get page

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

// for user registration

app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });

    const hashedPassword = await hashPashword(password);

    // chack existing user

    if (!existingUser) {
      const data = new Registration({
        name,
        email,
        phone,
        password: hashedPassword,
      });
      await data.save();
      res.redirect("/success");
    } else {
      console.log("User Alredy Register");
      res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

// for get success page

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

// for get error page

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
