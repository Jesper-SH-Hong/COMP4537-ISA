const http = require("http");
const url = require("url");
let dt = require("./modules/myModule");


const server = http.createServer((req, res) => {
  const q = url.parse(req.url, true);

  const lab3Path = "/lab3";

  if (q.pathname === lab3Path) {
    // Handle lab3 route
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<span style="color: blue;">Hello ${
        q.query.name
      }, What a beautiful day. Server current date and time is: ${dt.getDate()} </span>`
    );
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
