const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const dotenv = require('dotenv').config()


const multer = require('multer');
const bodyParser = require('body-parser');

let port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.get('/video', function(req, res) {

  const path = 'assets/videos/sample.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})
app.get('/video/:id', function(req, res) {

  const path = 'assets/videos/'+req.params.id;
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, "./assets/videos");
  },
  filename: function(req, file, callback) {
      callback("_"+originalname);
      // callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});
var upload = multer({
  storage: Storage
}).array("imgUploader", 3); //Field name and max count




app.post("/api/Upload", function(req, res) {
  upload(req, res, function(err) {
      if (err) {
          return res.end("Something went wrong!");
      }
      return res.end("File uploaded sucessfully!.");
  });
});

app.listen(port, function () {
  console.log('Listening on port 3000!')
})
