const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./src/app" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIo(httpServer);

    // Import and use the socket setup
    require("./socket")(io);

    server.all("*", (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
