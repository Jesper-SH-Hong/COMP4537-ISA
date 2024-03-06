const messages = require("./message/msg.js");
const contentTypes = messages.contentType;
const http = require("http");
const url = require("url");
let dt = require("./modules/myModule");

const STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "jesperho_nodemysql",
  password: "nodemysql123",
  database: "jesperho_nodemysql",
});

class Server {
  constructor() {
    this.port = process.env.PORT || 3000;
  }

  start() {
    const q = url.parse(req.url, true);
    const lab5Path = messages.path.lab5Path;

    if (q.pathname === lab5Path) {
      const server = http.createServer((req, res) => {
        con.connect(function (err) {
          if (err) throw err;
          console.log("Connected!");
          var sql =
            "CREATE TABLE patient (patientID INT(11) AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), dateOfBirth DATETIME)";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
          });
        });

        res.setHeader("Access-Control-Allow-Origin", "*");

        res.writeHead(200, contentTypes.plainType);
        res.end("TABLE GENERATED?");
      });

      server.listen(this.port);
    }
  }
}

const server = new Server();
server.start();
