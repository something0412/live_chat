function ChatBubble(props: any) {
    const MessageBubble = () => {
        const time = new Date(props.time);
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "4% 2%",
                    alignItems: `${
                        props.currentUserID == props.user_id ? "end" : "start"
                    }`,
                }}
            >
                <span
                    style={{
                        marginLeft: 7,
                        marginRight: 7,
                        fontWeight: "bold",
                        fontSize: "25px",
                    }}
                >
                    {props.currentUserID == props.user_id ? "You" : props.user}
                </span>
                <div
                    style={{
                        backgroundColor: `${
                            props.currentUserID == props.user_id
                                ? "#3aa8acff"
                                : "#5e1d6eff"
                        }`,
                        padding: 10,
                        border: `2px solid ${
                            props.currentUserID == props.user_id
                                ? "#8ebec0ff"
                                : "#7e408dff"
                        }`,
                        borderRadius: 20,
                        maxWidth: "40%",
                        width: "fit-content",
                    }}
                >
                    <p
                        style={{
                            margin: 2,
                            wordWrap: "break-word",
                            fontSize: "25px",
                        }}
                    >
                        {props.text}
                    </p>
                </div>
                <span style={{ marginTop: "5px", fontSize: "20px" }}>
                    <span style={{ fontStyle: "italic" }}>
                        {time.toLocaleDateString()}
                    </span>{" "}
                    @ {time.toLocaleTimeString()}
                </span>
            </div>
        );
    };
    const AlertDisplay = () => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    fontSize: "20px",
                    opacity: "60%",
                    margin: "0 2%",
                    alignItems: "center",
                }}
            >
                <p>{props.text}</p>
            </div>
        );
    };

    return <>{props.type == "msg" ? <MessageBubble /> : <AlertDisplay />}</>;
}

export default ChatBubble;
