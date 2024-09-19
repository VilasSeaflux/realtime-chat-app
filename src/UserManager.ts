import type { Socket } from "socket.io";
import { OutgoingMessageType } from "./message/outgoingMessages";
interface User {
	name: string;
	id: string;
	connection: Socket;
}
interface Room {
	users: User[];
}
export class UserManager {
	private rooms: Map<string, Room>;
	constructor() {
		this.rooms = new Map<string, Room>();
	}

	getUser(userId: string, roomId: string) {
		const user = this.rooms
			.get(roomId)
			?.users.find((user) => user.id === userId);
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}

	addUser(userId: string, roomId: string, name: string, socket: Socket) {
		if (this.rooms.has(roomId)) {
			const room = this.rooms.get(roomId);
			if (room) {
				room.users.push({ name, id: userId, connection: socket });
			}
		}
		return;
	}
	removeUser(roomId: string, userId: string) {
		const users = this.rooms.get(roomId).users;
		if (users) {
			users.filter((user) => user.id !== userId);
		}
	}
	broadcasteMessage(
		roomId: string,
		userId: string,
		message: OutgoingMessageType,
	) {
		const room = this.rooms.get(roomId);
		if (!room) {
			throw new Error("Room not found");
		}
		const users = room.users;
		if (!users) {
			throw new Error("User not found");
		}
		const user = users.find((user) => user.id === userId);
		if (!user) {
			throw new Error("User not found");
		}
		for (const user of room.users) {
			user.connection.send(JSON.stringify(message));
		}
	}
}
