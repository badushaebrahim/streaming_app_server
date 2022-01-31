const express = require("express");
const app = express();
const fs = require("fs");
const path = require('path');
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
 // console.log(req);
});

app.get("/video", function (req, res) {
  // Ensure there is a range given for the video
  
  const range = req.headers.range;
  
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  // get video stats (about 61MB)
  const videoPath = "bigbuck.mp4";
  const videoSize = fs.statSync("bigbuck.mp4").size;
  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
});



app.get("/video/:folder/:file", function (req, res) {
  // Ensure there is a range given for the video
  const la = req.params.folder;
  const la2 = req.params.file;
  //console.log(la+","+la2)
  var man="video/"+la+"/"+la2
  const range = req.headers.range;
 
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  // get video stats (about 61MB)
  const videoPath = man;
  const videoSize = fs.statSync(man).size;
  const tama= path.extname(man);
 // console.log(tama)
  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 1*1e6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const added= "video/"+tama
  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": added,
  };
console.log(headers)
  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
 
const stream = fs.createReadStream(videoPath, { start, end });
stream.pipe(res);
});



app.listen(8000, function () {
  console.log("Listening on port 8000!");
});

//const chunkSize = 1 * 1e6;







