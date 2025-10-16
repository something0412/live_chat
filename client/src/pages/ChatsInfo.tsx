import { useState } from "react";
import { ObjectId } from "bson";
import ChatRoom from "../components/ChatRoom";

function ChatsInfo(props: any) {
    const [text, setText] = useState("");
    const socket = props.socket;

    const handleJoin = (e: any) => {
        e.preventDefault();
        if (text != "" && text != props.currentRoom) {
            // join new room
            socket.emit("join", {
                username: props.username,
                user_id: props.user_id,
                chat_id: text,
            });
        }
        // set new currentRoom
        props.setRoom(text);
        props.setList((prevList: any) => [
            ...prevList,
            { chat_id: text, chat_name: "" },
        ]);
        setText("");
    };
    const handleCreate = () => {
        // create a new ObjectID for new chat
        const newChatID = new ObjectId();
        socket.emit("join", {
            username: props.username,
            user_id: props.user_id,
            chat_id: newChatID.toString(),
        });
        // set new currentRoom
        props.setRoom(newChatID.toString());
        props.setList((prevList: any) => [
            ...prevList,
            { chat_id: newChatID.toString(), chat_name: "" },
        ]);
    };
    return (
        <div className="chats-display">
            <div className="create-join-room">
                <form
                    onSubmit={handleJoin}
                    style={{ display: "flex", flexDirection: "row" }}
                >
                    <input
                        type="text"
                        value={text}
                        placeholder="Enter chat ID"
                        onChange={(e) => setText(e.target.value)}
                        style={{ fontSize: "large" }}
                    />
                    <button type="submit">Join</button>
                </form>
                <button className="create-btn" onClick={handleCreate}>
                    Create Room
                </button>
            </div>
            <div className="chats-list">
                {props.list.map((chat: any, i: any) => (
                    <ChatRoom
                        key={i}
                        index={i + 1}
                        chat_id={chat["chat_id"]}
                        chat_name={chat["chat_name"]}
                        socket={socket}
                        username={props.username}
                        user_id={props.user_id}
                        setRoom={props.setRoom}
                    />
                ))}
            </div>
        </div>
    );
}

export default ChatsInfo;
