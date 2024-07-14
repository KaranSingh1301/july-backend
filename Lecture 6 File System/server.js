//create http server
const http = require("http");
const fs = require("fs");

//const app = express()
const server = http.createServer();
const PORT = 8000;

server.on("request", (req, res) => {
  console.log(req.method + " " + req.url);

  const data = "This is file system class";

  if (req.method === "GET" && req.url === "/") {
    return res.end("Server is up and running");
  }
  //write
  else if (req.method === "GET" && req.url === "/writefile") {
    fs.writeFile("demo.txt", data, (err) => {
      if (err) throw err;

      return;
    });
    return res.end("Write successfull");
  }
  //append
  else if (req.method === "GET" && req.url === "/appendfile") {
    fs.appendFile("demo.txt", data, (err) => {
      if (err) throw err;
      return;
    });
    return res.end("Append successfull");
  }
  //read
  else if (req.method === "GET" && req.url === "/readfile") {
    fs.readFile("demo.txt", (err, data) => {
      if (err) throw err;
      console.log(data);
      return res.end(data);
    });
  }
  //delete
  else if (req.method === "GET" && req.url === "/deletefile") {
    fs.unlink("for.html", (err) => {
      if (err) throw err;
      return res.end("Delete successfull");
    });
  }
  //rename
  else if (req.method === "GET" && req.url === "/renamefile") {
    fs.rename("demo.txt", "uploads/newDemo.txt", (err) => {
      if (err) throw err;
      return res.end("Rename successfull");
    });
  }

  //stream read
  else if (req.method === "GET" && req.url === "/streamread") {
    const rStream = fs.createReadStream("demo.txt");

    rStream.on("data", (char) => {
      res.end(char);
    });

    rStream.on("end", () => {
      return res.end();
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
