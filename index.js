const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const hubsRouter = require("./hubs/hubs-router.js");
const toss = require("./random/toss.js");
const server = express();
// global middleware
server.use(express.json()); // built-in middleware
server.use(helmet()); // third pary mw, needs to be installed from npm
server.use(logger());
// middleware for coin toss
// server.use(toss);
server.use("/api/hubs", gate("mellon"), hubsRouter);
server.get("/", (req, res) => {
    const nameInsert = req.name ? ` ${req.name}` : "";
    res.status(200).json({ hello: "world", coin: req.coin });
});
// add an endpoint for /toss that returns randomly head or tail
// return heads for true and tails for false
// add the code to determine the result as middleware
// so this endpoint works
server.get("/toss", toss, (req, res) => {
    res.status(200).json({ toss: req.coin });
});

// the gate middleware will read a password from the headers of the request and compare it to the provided password
// if passwords match, let the request continue
// if they don't match, stop the request, produce a response with httt status code 401 and a message
function gate(password) {
  return function (req, res, next) {
    req.headers.password === password ? next() : res.status(401).json({ error: 'incorrect password' })
  }
}

function logger() {
    return (req, res, next) => {
        console.log(`a ${req.method} request was made to ${req.url}`);
        next();
    };
}

server.listen(port =4000, () => {
	console.log(`Server running at http://localhost:${port}`)
})

module.exports = server;

