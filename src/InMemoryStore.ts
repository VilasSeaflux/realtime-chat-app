import type { Chat, Store } from "./store/Store";

let globalChat = 0;
export interface Room {
	roomId: string;
	chats: Chat[];
}

export class InMemoryStore implements Store {
	private store: Map<string, Room>;
	constructor() {
		this.store = new Map<string, Room>();
	}
	initRoom(roomId: string) {
		this.store.set(roomId, {
			roomId,
			chats: [],
		});
	}
	getChat(roomId: string, limit: number, offset: number) {
		const room = this.store.get(roomId);
		if (!room) {
			return [];
		}
		return room.chats
			.reverse()
			.slice(0, offset)
			.slice(-1 * limit);
	}
	addChat(userId: string, name: string, message: string, roomId: string) {
		const room = this.store.get(roomId);
		if (!room) {
			return;
		}
		const chat = {
			chatId: (globalChat++).toString(),
			userId,
			name,
			message,
			upvotes: [],
		};
		room.chats.push(chat);
		return chat;
	}
	upvote(roomId: string, chatId: string, userId: string) {
		const room = this.store.get(roomId);
		if (!room) {
			return;
		}
		const chat = room.chats.find((chat) => chat.chatId === chatId);
		if (!chat) {
			return;
		}
		chat.upvotes.push(userId);
		return chat;
	}
}
