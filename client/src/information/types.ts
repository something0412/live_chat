import { Socket } from "socket.io-client";

export interface LoginProps {
  onLogin: (data: LoginData) => void;
} 

export type LoginData = {
    username: string;
    user_id: string;
    chats: ChatListItem[];
};

export interface ChatListItem{
  chat_id: string;
  chat_name: string;
}

export interface ChatsProps {
  socket: Socket;
  username: string;
  user_id: string;
  currentRoom: string;
  setRoom: (room: string) => void;
  list: ChatListItem[];
  setList: React.Dispatch<React.SetStateAction<ChatListItem[]>>;
}

export interface ChatMessage {
    user_id: string;
    chat_id: string;
    user: string;
    text: string;
    time: string | Date;
    type: string;
}

export interface ChatRoomProps {
  socket: Socket;
  username: string;
  user_id: string;
  chat_id: string;
  chat_name: string;
  index: number;
  setRoom: (room: string) => void;
}
export interface ChatBubbleProps {
    currentUserID: string;
    user_id: string;
    user: string;
    text: string;
    time: string | Date;
    type: string;
}