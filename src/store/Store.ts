type UserId = string;
export interface Chat {
	chatId: string;
	name: UserId;
	userId: string;
	message: string;
	upvotes: string[];
}

export abstract class Store {
	constructor() {}
	initRoom(roomId: string) {}
	getChat(roomId: string, limit: number, offset: number) {}
	addChat(
		userId: string,
		name: string,
		roomId: string,
		message: string,
		limit: number,
		offset: number,
	) {}
	upvote(roomId: string, chatId: string, userId: string) {}
}
