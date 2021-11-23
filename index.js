const express = require("express");
const cors = require("cors");
const config = require("./src/config");

const port = config.port;

var app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", (req, res) => {
  const message = "Server Nyala";
  console.log(message);
  res.status(200).json({ message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

module.exports = app;
