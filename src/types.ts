
export interface AuthInterface {
    name: string;
    token: string;
    message: string;
    id: string;
    username?: string;
}

export interface UserInterface {
    _id: string;
    username: string;
    email: string;
    profilepic?: string;
    createdAt?: string;
    isAdmin?: boolean
}

export interface ConversationInterface {
    _id: string;
    members: string[];
    createdAt: string;
    updatesAt: string;
}

export interface MessageInterface {
    _id: string;
    conversationId: string;
    sender: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

export interface OnlineUser {
    userId: string, 
    soketId: string
}
