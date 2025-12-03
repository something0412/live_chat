import { useState } from "react";

import type { ChatRoomProps } from "../information/types";

function ChatRoom(props: ChatRoomProps) {
    const [name, setName] = useState(props.chat_name);
    // go to chat if clicked
    const handleClick = () => {
        props.socket.emit("join", {
            username: props.username,
            user_id: props.user_id,
            chat_id: props.chat_id,
        });
        props.setRoom(props.chat_id);
    };
    // change chat name
    const handleEdit = () => {
        let newName = prompt("Name")?.trim();
        if (!newName) return;
        props.socket.emit("change_chat_name", {
            name: newName,
            chat_id: props.chat_id,
            user_id: props.user_id,
        });
        setName(newName);
    };

    return (
        <div
            style={{
                backgroundColor: "#8c92ac",
                borderBottom: "2px solid black",
                width: "100%",
                height: "11%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    margin: "20px",
                    flex: 1,
                }}
                onClick={handleClick}
            >
                <h3 style={{ margin: 0, fontSize: "30px" }}>
                    {name ? name : `Chat ${props.index}`}
                </h3>
            </div>
            <button
                style={{
                    marginRight: "20px",
                    borderRadius: "50%",
                    height: "37px",
                    width: "37px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: "60%",
                    backgroundColor: "#8c92ac",
                }}
                onClick={handleEdit}
            >
                <p style={{ fontSize: "30px", margin: 0 }}>ⓘ</p>
            </button>
        </div>
    );
}

export default ChatRoom;
