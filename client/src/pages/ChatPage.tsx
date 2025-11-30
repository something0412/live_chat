import { useEffect, useState, useRef } from "react";
import ChatBubble from "../components/ChatBubble";

function ChatPage(props: any) {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [chatName, setChatName] = useState("");
    const endRef = useRef<HTMLDivElement | null>(null);
    const socket = props.socket;

    // Receive signals from server
    useEffect(() => {
        socket.on("name_changed", (name: any) => {
            setChatName(name);
        });
        socket.on("load_messages", (arr: any) => {
            setMessages(arr);
        });
        socket.on("from_server", (obj: any) => {
            if (obj["chat_id"] == props.currentRoom) {
                setMessages((prev) => [...prev, obj]);
            }
        });

        socket.on("left_room", (id: any) => {
            if (id == props.user_id) {
                setMessages([]);
            }
        });

        socket.on("get_chatName", (data: any) => {
            const currentChat = data.find(
                (chat: any) => chat["chat_id"] == props.currentRoom
            );
            setChatName(currentChat ? currentChat["chat_name"] : chatName);
        });

        // cleanup
        return () => {
            socket.off("user_id");
            socket.off("from_server");
            socket.off("load_messages");
            socket.off("name_changed");
            socket.off("get_chatName");
        };
    }, [props.currentRoom]);

    // focus on the latest message shown (auto scroll down)
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // send message to server
    const sendMessage = () => {
        if (input.trim() === "" || props.currentRoom === "") return;
        socket.emit("chat_message", {
            user_id: props.user_id,
            chat_id: props.currentRoom,
            user: props.username,
            text: input,
            time: new Date(),
            type: "msg",
        });
        setInput("");
    };

    const handleKeyDown = (e: any) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    // remove chat from user data
    const handleLeave = () => {
        socket.emit("leave", {
            username: props.username,
            chat_id: props.currentRoom,
            user_id: props.user_id,
        });
        props.setRoom("");
        setChatName("");
        const newList = props.list.filter(
            (chat: any) => chat["chat_id"] != props.currentRoom
        );
        props.setList(newList);
    };

    return (
        <>
            <div className="chat-area">
                <div className="header">
                    <div className="chat-info">
                        <h1 className="chat-name">{chatName}</h1>
                        {props.currentRoom ? (
                            <span>
                                <b>ChatID:</b> <i>{props.currentRoom}</i>
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                    <button className="delete-chat" onClick={handleLeave}>
                        Delete
                    </button>
                </div>
                <div className="message-display">
                    {messages.map((msg: any, i) => (
                        <ChatBubble
                            key={i}
                            currentUserID={props.user_id}
                            text={msg["text"]}
                            user_id={msg["user_id"]}
                            user={msg["user"]}
                            time={msg["time"]}
                            type={msg["type"]}
                        />
                    ))}
                    <div ref={endRef} />
                </div>
                <div className="chat-input-container">
                    <input
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="send-btn"
                        onClick={() => {
                            sendMessage();
                        }}
                    >
                        ⌯⌲
                    </button>
                </div>
            </div>
        </>
    );
}

export default ChatPage;
