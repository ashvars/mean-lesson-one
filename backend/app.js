const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

const userRoutes = require("./routes/users");

const app = express();

mongoose.connect("mongodb+srv://varun:" + process.env.MONGO_PWD + "@mongo-aws-cluster0-mmhru.mongodb.net/test?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.error("Connection error to DB" + err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname,"images")))
app.use("/", express.static(path.join(__dirname,"angular")))

// app.use((req,res,next) => {
//   res.setHeader('Access-Control-Allow-Origin', "*");
//   res.setHeader('Access-Control-Allow-Headers', "Origin,X-Requested-With, Content-Type, Accept, Authorization");
//   res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, PUT, OPTIONS");
//   next();
// });

app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use((req,res,next) => {
  res.sendFile(path.join(__dirname,"angular","index.html"));
})

module.exports = app;
