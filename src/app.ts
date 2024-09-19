import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { type Socket, Server as SocketIO } from "socket.io";
import { InMemoryStore } from "./InMemoryStore";
import { UserManager } from "./UserManager";
import {
	type IncomingMessage,
	SupportedMessage,
} from "./message/incomingMessages";
import {
	type OutgoingMessageType as OutgoingMessage,
	SupportedMessage as OutgoingMessageType,
} from "./message/outgoingMessages";

const app = express();
const server = createServer(app);
const io = new SocketIO(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(io);
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "index.html"));
});

const userManager = new UserManager();
const store = new InMemoryStore();
io.on("connection", (socket) => {
	socket.on("message", (msg) => {
		if (msg) {
			try {
				messageHandler(socket, JSON.parse(msg));
			} catch (e) {
				console.log(e);
			}
		}
	});
});

const messageHandler = (socket: Socket, msg: IncomingMessage) => {
	if (msg.type === SupportedMessage.JoinRoom) {
		const payload = msg.payload;
		userManager.addUser(payload.userId, payload.roomId, payload.name, socket);
	}
	if (msg.type === SupportedMessage.SendMessage) {
		const payload = msg.payload;
		const user = userManager.getUser(payload.userId, payload.roomId);
		if (!user) {
			console.log("user not found....");
			return;
		}

		const chat = store.addChat(
			payload.userId,
			payload.message,
			payload.roomId,
			user.name,
		);
		const message: OutgoingMessage = {
			type: OutgoingMessageType.addChat,
			payload: {
				chatId: chat.chatId,
				roomId: payload.roomId,
				message: payload.message,
				name: user.name,
				upvotes: 0,
			},
		};
		userManager.broadcasteMessage(payload.roomId, payload.userId, message);
	}
	if (msg.type === SupportedMessage.UpvoteMessage) {
		const payload = msg.payload;
		const chat = store.upvote(payload.chatId, payload.userId, payload.roomId);
		if (!chat) {
			console.log("chat not found....");
		}
		const OutgoingMessage: OutgoingMessage = {
			type: OutgoingMessageType.UpdateChat,
			payload: {
				chatId: payload.chatId,
				roomId: payload.roomId,
				upvotes: chat.upvotes.length,
			},
		};
		userManager.broadcasteMessage(
			payload.roomId,
			payload.userId,
			OutgoingMessage,
		);
	}
};
server.listen(8080, () => {
	console.log("Server is running on port 8080");
});
