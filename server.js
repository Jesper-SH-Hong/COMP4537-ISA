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
    const server = http.createServer((req, res) => {
      const q = url.parse(req.url, true);
      const lab5Path = messages.path.lab5Path;

      res.setHeader("Access-Control-Allow-Origin", "*");

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

      if (q.pathname == `${lab5Path}/get`) {
        console.log("GET CALLED!!");
        con.query(q.query.query, (err, result) => {
          if (err) {
            res.status(500).json({ error: err });
            res.end();
          } else {
            res.writeHead(STATUS.OK);
            res.end(JSON.stringify({ status: "success", data: result }));
          }
        });
      } else if (q.pathname == `${lab5Path}/post`) {
        console.log("POST CALLED!!");

        if (req.headers["access-control-request-method"]) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST");
          res.end();
        } else {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            console.log(body);

            con.query(body, (err, result) => {
              if (err) {
                res.status(500).json({ error: err });
                res.end();
              } else {
                res.writeHead(STATUS.OK);
                res.end(JSON.stringify({ status: "success", data: result }));
              }
            });
          });
        }
      }
    });

    server.listen(this.port);
  }
}

const server = new Server();
server.start();
