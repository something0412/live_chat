from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from pymongo import MongoClient
from datetime import datetime, UTC
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
app = Flask(__name__)

# add any origins needed
allowed_origins = [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5000"
]

CORS(app, origins=allowed_origins, supports_credentials=True)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

socketio = SocketIO(
    app,
    cors_allowed_origins=allowed_origins,
    cors_credentials=True
)

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["chatApp"]
users_collection = db["users"]
chats_collection = db["chats"]


# ==================================================
# LOGIN
# ==================================================
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username is required"}), 400

    existing_user = users_collection.find_one({"username": username})

    if not existing_user:
        users_collection.insert_one({
            "username": username,
            "dialogues": []
        })
        print(f"{username} has been added.")
    else:
        print(f"{username} has logged in")

    user = users_collection.find_one({"username": username})

    return jsonify({
        "msg": "Login successful",
        "username": username,
        "user_id": str(user["_id"]),
        "chats": user["dialogues"]
    }), 200


# ==================================================
# SEND MESSAGE
# ==================================================
@socketio.on('chat_message')
def handle_chat(data):
    chat_id = ObjectId(data['chat_id'])
    
    chats_collection.update_one(
        {"_id": chat_id},
        {"$push": {"messages": data}}
    )
    
    # check if the data is sent correctly
    print("💬", data)

    emit('from_server', data, room=data['chat_id'], broadcast=True)


# ==================================================
# JOIN ROOM
# ==================================================
@socketio.on("join")
def on_join(data):
    username = data["username"]
    room = data["chat_id"]
    chat_id = ObjectId(room)
    user_id = ObjectId(data["user_id"])

    join_room(room)

    chat = chats_collection.find_one({"_id": chat_id})
    if not chat:
        chats_collection.insert_one({
            "_id": chat_id,
            "messages": [
                {"text": f"{username} created the room.", "type": "alert", "timestamp": datetime.now(UTC).isoformat()}
            ]
        })

    if not users_collection.find_one({"_id": user_id, "dialogues.chat_id": room}):
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"dialogues": {"chat_id": room, "chat_name": ""}}}
        )

        join_message = {
            "chat_id": f"{chat_id}",
            "text": f"{username} joined the room.",
            "type": "alert",
            "timestamp": datetime.now(UTC).isoformat()
        }

        chats_collection.update_one(
            {"_id": chat_id},
            {"$push": {"messages": join_message}}
        )

        emit("from_server", join_message, room=room)

    messages = chats_collection.find_one({"_id": chat_id})["messages"]
    emit("load_messages", messages)

    user_chats = users_collection.find_one({"_id": user_id})["dialogues"]
    emit("get_chatName", user_chats)


# ==================================================
# LEAVE ROOM
# ==================================================
@socketio.on("leave")
def on_leave(data):
    username = data["username"]
    room = data["chat_id"]
    user_id = ObjectId(data["user_id"])
    chat_id = ObjectId(room)

    leave_room(room)

    leave_message = {
        "chat_id": f"{chat_id}",
        "text": f"{username} left the room.",
        "type": "alert",
        "timestamp": datetime.now(UTC).isoformat()
    }

    emit("from_server", leave_message, room=room)

    chats_collection.update_one(
        {"_id": chat_id},
        {"$push": {"messages": leave_message}}
    )

    users_collection.update_one(
        {"_id": user_id},
        {"$pull": {"dialogues": {"chat_id": room}}}
    )

    emit("left_room", str(user_id))


# ==================================================
# CHANGE CHAT NAME
# ==================================================
@socketio.on("change_chat_name")
def change_chat_name(data):
    name = data["name"]
    chat_id = data["chat_id"]
    user_id = ObjectId(data["user_id"])

    users_collection.update_one(
        {"_id": user_id, "dialogues.chat_id": chat_id},
        {"$set": {"dialogues.$.chat_name": name}}
    )

    emit("name_changed", name)


# ==================================================
# RUN SERVER
# ==================================================
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)