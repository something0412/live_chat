from flask import Flask, request, jsonify, session, redirect, url_for
import os
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()
app = Flask(__name__)

allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5000"
]

CORS(app, origins=allowed_origins, supports_credentials=True)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # needed for sessions
socketio = SocketIO(app, cors_allowed_origins=allowed_origins)  # allow only frontend(s) in allowed_origins

# MongoDB setup
client = MongoClient(os.getenv('MONGO_URI'))
db = client["chatApp"]
users_collection = db["users"]
chats_collection = db["chats"]


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    existing_user = users_collection.find_one({"username": username})

    if not existing_user:
        users_collection.insert_one({"username": username, "dialogues": []})
        print(f'{username} has been added.')
    else:
        print(f'{username} has logged in')
    
    # get user data from MongoDB
    current_user = users_collection.find_one({"username": username})
    user_id =  str(current_user['_id'])
    user_dialogues = current_user['dialogues']

    return jsonify({'msg': 'Login successful', 'username': username, 'user_id': user_id, 'chats': user_dialogues}), 200


# Handle send message
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

# Handle join chat
@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['chat_id']
    chat_id = ObjectId(data['chat_id'])
    user_id = ObjectId(data['user_id'])
    join_room(room)
    if not chats_collection.find_one({"_id": chat_id}):
        chats_collection.insert_one({
            "_id": chat_id,
            "messages": [{'text': f'{username} has created room {room}.', 'type':'alert'}]
        })
    
    if not users_collection.find_one({'_id': user_id, 'dialogues.chat_id': room}):
        users_collection.update_one(
            {"_id": user_id},
            {"$push": {"dialogues": {'chat_id': room,  'chat_name': ""}}}
        )
        chats_collection.update_one(
            {"_id": chat_id},
            {"$push": {'messages':{'text': f'{username} has entered room {room}.', 'type':'alert'}}}
        )
        emit('from_server', {'text': f'{username} has joined room {room}.','type':'alert'}, room=room)

    emit("load_messages", chats_collection.find_one({"_id": chat_id})['messages'])
    user_chatList = users_collection.find_one({'_id': user_id,})['dialogues']
    emit('get_chatName', user_chatList)

# Handle leave chat
@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['chat_id']
    user_id  = data['user_id']
    chat_id = ObjectId(data['chat_id'])
    leave_room(room)
    emit('from_server', {'text': f'{username} has left room {room}.','type':'alert'}, room=room)
    chats_collection.update_one(
        {"_id": chat_id},
        {"$push": {'messages': {'text': f'{username} has left room {room}.','type':'alert'}}}
    )
    users_collection.update_one({"_id": ObjectId(user_id)},{"$pull": {"dialogues": {'chat_id': room}}})
    emit('left_room', user_id)

# Handle change chat name
@socketio.on("change_chat_name")
def on_changeChatName(data):
    name = data['name']
    chat_id = data['chat_id']
    user_id = ObjectId(data['user_id'])
    users_collection.update_one({'_id': user_id, 'dialogues.chat_id': chat_id}, {'$set': {"dialogues.$.chat_name": name}})
    emit('name_changed', name)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
