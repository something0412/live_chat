import ChatsInfo from "./ChatsInfo";
import ChatPage from "./ChatPage";
import { io, Socket } from "socket.io-client";
import { useState } from "react";

import type { ChatListItem, LoginData } from "../information/types";

const socket: Socket = io("http://localhost:5000");

function Main(props: LoginData) {
    const [room, setRoom] = useState<string>("");
    const [list, setList] = useState<ChatListItem[]>(props.chats);
    return (
        <div className="main-interface">
            <ChatsInfo
                socket={socket}
                username={props.username}
                user_id={props.user_id}
                currentRoom={room}
                setRoom={setRoom}
                list={list}
                setList={setList}
            />
            <ChatPage
                socket={socket}
                username={props.username}
                user_id={props.user_id}
                currentRoom={room}
                setRoom={setRoom}
                list={list}
                setList={setList}
            />
        </div>
    );
}

export default Main;
