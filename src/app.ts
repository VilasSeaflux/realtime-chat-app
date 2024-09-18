import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server as SocketIO } from "socket.io";

const app = express();
const server = createServer(app);
const io = new SocketIO(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(io);
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "index.html"));
});

let user = 0;
io.on("connection", (socket) => {
	console.log("New user connected", ++user);
	socket.on("disconnect", () => {
		console.log("User disconnected", --user);
	});
	socket.on("chat message", (msg) => {
		console.log("message from client...", msg);
		socket.send("message received");
		io.emit("chat message", msg);
	});
});

server.listen(8080, () => {
	console.log("Server is running on port 8080");
});
