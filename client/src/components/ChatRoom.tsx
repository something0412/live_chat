import { useState } from "react";

function ChatRoom(props: any) {
    const [name, setName] = useState(props.chat_name); // cannot get chat_name from db.
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
                borderBottom: "2px solid black",
                width: "100%",
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
                <h3 style={{ margin: 0 }}>
                    {name ? name : `Chat ${props.index}`}
                </h3>
            </div>
            <button
                style={{
                    marginRight: "20px",
                    borderRadius: "50%",
                    height: "40px",
                    width: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: "60%",
                }}
                onClick={handleEdit}
            >
                <p style={{ fontSize: "20px", margin: 0 }}>ⓘ</p>
            </button>
        </div>
    );
}

export default ChatRoom;
