var createError = require("http-errors");
var express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
//connecting to mongoDb
mongoose.connect("mongodb://localhost:27017/IMGDB").then(() => {
  console.log("DB connected successfully");
});

const imgSchema = new mongoose.Schema({
  picture: String,
});

const imgModel = mongoose.model("images", imgSchema);
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
});
var app = express();
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.post("/singlepost", upload.single("pictures"), (req, res) => {
  try {
    imgModel
      .create({ picture: req.file.originalname })
      .then((x) => {
        res.redirect("/view");
      })
      .catch((err) => console.log(err.message));
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/view", (req, res) => {
  imgModel
    .find({})
    .then((x) => {
      console.log(x);
      res.render("preview", { x });
    })
    .catch((err) => res.send(err));
});

app.listen(3000, () => console.log("server started on port : 3000"));

module.exports = app;
