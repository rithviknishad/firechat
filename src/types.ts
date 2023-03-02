export declare type ChatRoomID = string;
export declare type ChatCategory = string;
export declare type ChatAuthorID = string;
export declare type ChatMessageReaction = string;
export declare type Timestamp = number;

export declare interface ChatReactions {
  [key: ChatMessageReaction]: {
    [key: ChatAuthorID]: Timestamp;
  };
}

export declare interface ChatMessage {
  author: ChatAuthorID;
  message: string;
  timestamp: Timestamp;
  reactions: ChatReactions;
}
