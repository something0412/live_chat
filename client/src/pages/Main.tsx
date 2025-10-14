import ChatsInfo from "./ChatsInfo";
import ChatPage from "./ChatPage";
import { io, Socket } from "socket.io-client";
import { useState } from "react";

const socket: Socket = io("http://localhost:5000");

function Main(props: any) {
    const [room, setRoom] = useState("");
    const [list, setList] = useState(props.chats);
    return (
        <div className="main-interface">
            <ChatsInfo
                socket={socket}
                username={props.username}
                user_id={props.id}
                currentRoom={room}
                setRoom={setRoom}
                list={list}
                setList={setList}
            />
            <ChatPage
                socket={socket}
                username={props.username}
                user_id={props.id}
                currentRoom={room}
                setRoom={setRoom}
                list={list}
                setList={setList}
            />
        </div>
    );
}

export default Main;
