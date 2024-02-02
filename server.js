const messages = require("./message/msg.js");
const http = require("http");
const url = require("url");
let dt = require("./modules/myModule");

class Server {
  constructor() {
    this.port = process.env.PORT || 3000;
  }

  generateNamedResponse(name) {
    console.log(messages);
    return `${messages.inlineStyleOpen} ${messages.hello} ${name}, ${
      messages.greeting
    } ${dt.getDate()} ${messages.inlineStyleClose}`;
  }

  start() {
    const server = http.createServer((req, res) => {
      const q = url.parse(req.url, true);

      const lab3Path = "/lab3";

      if (q.pathname === lab3Path) {
        res.writeHead(200, { "Content-Type": "text/html" });
        let message = this.generateNamedResponse(q.query.name);
        res.end(message);
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });

    server.listen(this.port);
  }
}

const server = new Server();
server.start();
