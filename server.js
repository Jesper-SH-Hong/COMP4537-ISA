const messages = require("./message/msg.js");
const contentTypes = messages.contentType;
const http = require("http");
const url = require("url");
let dt = require("./modules/myModule");

class Server {
  constructor() {
    this.port = process.env.PORT || 3000;
  }

  generateNamedResponse(name) {
    const greetingMessage = messages.greetingTemplate.replace("%s", name);
    return `${messages.inlineStyleOpen}${greetingMessage} ${dt.getDate()} ${
      messages.inlineStyleClose
    }`;
  }

  start() {
    const server = http.createServer((req, res) => {
      const q = url.parse(req.url, true);
      const lab3Path = messages.path.lab3Path;

      if (q.pathname === lab3Path) {
        res.writeHead(200, contentTypes.htmlType);
        let message = this.generateNamedResponse(q.query.name);
        res.end(message);
      } else {
        res.writeHead(404, contentTypes.plainType);
        res.end(messages.notFound);
      }
    });

    server.listen(this.port);
  }
}

const server = new Server();
server.start();
