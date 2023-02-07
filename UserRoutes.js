const express = require('express');
const userModel = require('./User');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");

app.use(bodyParser.json());

app.get("/rooms", (req, res) => {
    res.sendFile(path.join(__dirname, "rooms.html"));
  });
  

app.post("/signup", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = await userModel.findOne({ $or: [{ username }, { email }] });
      if (user) {
        return res.status(400).send("Username or email already taken");
      }
      const newUser = await userModel.create({ username, password, email });
      res.status(200).send({ message: "Signup successful" });
    } catch (error) {
      res.status(500).send({ message: "Error saving user to database" });
    }
});
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).send("Username not found");
    }
    if (user.password !== password) {
      return res.status(400).send("Incorrect password");
    }
    res.status(200).send("login successful")

  });

  module.exports = app;