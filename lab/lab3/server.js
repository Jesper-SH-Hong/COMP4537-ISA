const http = require("http");
let url = require("url");
let dt = require("./myModule.js");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  let q = url.parse(req.url, true);

  res.end(
    `<span style="color: blue;">Hello ${
      q.query.name
    }, What a beautiful day. Server current date and time is: ${dt.getDate()} </span>`
  );
});

const PORT = process.env.PORT || 8888;

server.listen(process.env.PORT || 8888, () => {
    console.log(`Server is running on ${PORT}`);
    });