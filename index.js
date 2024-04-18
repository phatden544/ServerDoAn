const express = require('express');
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const port = 3000;
const songRoute = require("./routes/song");
const playlistRoute = require("./routes/playlist");
const userRoute = require("./routes/user");
const genreRoute = require("./routes/genre");
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cors());
app.use(morgan("common"));

mongoose.connect(
    "mongodb+srv://phatden544:matkhauthat@cluster0.mr8aijh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    (err) => {
        if (err) console.log(err)
        else console.log("mongdb is connected");
    }
);
app.use("/v1/song", songRoute);
app.use("/v1/playlist", playlistRoute);
app.use("/v1/user", userRoute);
app.use("/v1/genre", genreRoute)

app.get('/api', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})