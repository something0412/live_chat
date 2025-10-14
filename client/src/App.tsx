import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Main from "./pages/Main";
import "./App.css";

export default function App() {
    const [username, setUsername] = useState("");
    const [userID, setUserID] = useState("");
    const [chats, setChats] = useState([]);

    const handleLogin = (data: any) => {
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
                                id={userID}
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
