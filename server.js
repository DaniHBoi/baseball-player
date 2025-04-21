const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 8001;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "baseball";

MongoClient.connect(dbConnectionStr).then((client) => {
  console.log(`Connected to ${dbName} Database`);
  db = client.db(dbName);
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (request, response) => {
  db.collection("baseball-players")
    .find()
    .sort({ likes: -1 })
    .toArray()
    .then((data) => {
      response.render("index.ejs", { info: data });
    })
    .catch((error) => console.error(error));
});

app.post("/addBaseBall-Player", (request, response) => {
  db.collection("baseball-players")
    .insertOne({
      bBName: request.body.bBName,
      bBNumber: request.body.bBNumber,
      bBTeam: request.body.bBTeam,
      likes: 0,
    })
    .then((result) => {
      console.log("BaseBall-Player Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.put("/addOneLike", (request, response) => {
  db.collection("baseball-players")
    .updateOne(
      {
        bBName: request.body.bBNameS,
        bBNumber: request.body.bBNumberS,
        bBTeam: request.body.bBTeamS,
        likes: request.body.likesS,
      },
      {
        $set: {
          likes: request.body.likesS + 1,
        },
      },
      {
        sort: { _id: -1 },
        upsert: true,
      }
    )
    .then((result) => {
      console.log("Added One Like");
      response.json("Like Added");
    })
    .catch((error) => console.error(error));
});

app.delete("/deleteBaseBallPlayer", (request, response) => {
  db.collection("baseball-players")
    .deleteOne({ bBName: request.body.bBNameS })
    .then((result) => {
      console.log("BaseBall-Player Deleted");
      response.json("BaseBall-Player Deleted");
    })
    .catch((error) => console.error(error));
});
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running!");
});
