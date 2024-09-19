export enum SupportedMessage {
	addChat = "ADD_CHAT",
	UpdateChat = "UPDATE_CHAT",
}

export type MessagePayload = {
	name: string;
	roomId: string;
	message: string;
	upvotes: number;
	chatId: string;
};
export type OutgoingMessageType =
	| {
			type: SupportedMessage.addChat;
			payload: MessagePayload;
	  }
	| {
			type: SupportedMessage.UpdateChat;
			payload: Partial<MessagePayload>;
	  };
