const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const {getUsers, getMemes, postMeme, deleteMemeByID, patchMemeByID, getMemeByID} = require("./controllers")

app.get("/api/users", getUsers);
app.get("/api/memes", getMemes);
app.post("/api/memes", postMeme);
app.get("/api/memes/:meme_id", getMemeByID);
app.delete("/api/memes/:meme_id", deleteMemeByID);
app.patch("/api/memes/:meme_id", patchMemeByID);

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });

module.exports = app;