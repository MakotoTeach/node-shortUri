const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("morgan");
require("dotenv").config();

const routes = require("./routes/routes");
const mainController = require('./controllers/main')
const dbUri = process.env.MONGO_DB_URI;

mongoose
  .connect(dbUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("db connected...");
  })
  .catch(err => {
    console.log("DB connecting", err);
    process.exit(1);
  });

app.disable("x-powered-by");
app.use(logger("dev"));
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("static"));

app.get("/:url", mainController);

// app.get('/result', (req, res) =>{
//   res.render('result')
// })

app.get("/", (req, res) => {
  res.render("home", {
    title: "Short Url", //page title
    action: "api/url/create", //post action for the form
    fields: [
      { name: "url", type: "url", property: "required" } //first field for the form
    ]
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.render("404");
});

app.listen(port, () => console.log(`Server is running on ${port}`));
