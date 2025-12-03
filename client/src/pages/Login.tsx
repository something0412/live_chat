import { useState } from "react";
import type { LoginProps } from "../information/types";

function Login(props: LoginProps) {
    const [username, setUsername] = useState<string>("");
    // const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (res.ok) {
                props.onLogin(data);
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Error:", err);
        }
        console.log("Submitting username:", username);
    };

    return (
        <div className="login-screen">
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="login-header">Enter username: </h2>
                <input
                    className="login-input"
                    value={username}
                    type="text"
                    name="User"
                    placeholder="username"
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                ></input>
                <br />
                <button
                    style={{
                        fontSize: "larger",
                    }}
                    type="submit"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Login;
