const express = require("express");
const cors = require("cors");
const { port } = require("./src/config");

var app = express();
app.use(cors());

const urlV1 = "/api/v1";
const photographerRoute = require("./src/routes/photographer");

app.use(`${urlV1}/photographers`, photographerRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", (req, res) => {
  const message = "Server Nyala";
  res.status(200).json({ message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

module.exports = app;
