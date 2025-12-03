import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Main from "./pages/Main";
import "./App.css";

import type { ChatListItem, LoginData } from "./information/types";

export default function App() {
    const [username, setUsername] = useState<string>("");
    const [userID, setUserID] = useState<string>("");
    const [chats, setChats] = useState<ChatListItem[]>([]);

    const handleLogin = (data: LoginData) => {
        setUsername(data["username"]);
        setUserID(data["user_id"]);
        setChats(data["chats"]);
    };

    return (
        <div>
            <Routes>
                <Route
                    path="/"
                    element={
                        username ? (
                            <Main
                                username={username}
                                user_id={userID}
                                chats={chats}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={
                        username ? (
                            <Navigate to="/" />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
            </Routes>
        </div>
    );
}
