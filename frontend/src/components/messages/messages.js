import React, { useState, useEffect } from "react";
import axios from "axios";

const Message = () => {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(""); // State for the selected receiver
  const [inputMessage, setInputMessage] = useState(""); // State for input message
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState("123456"); // This should come from your logged-in user's data

  useEffect(() => {
    // Fetch users to populate the receiver list
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const filteredUsers = response.data.filter(user => user._id !== senderId); // Exclude the current user
        setUsers(filteredUsers);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [senderId]);

  useEffect(() => {
    // Fetch messages when receiverId changes
    if (receiverId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/messages/conversation/${senderId}/${receiverId}`
          );
          setMessages(response.data);
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };
      fetchMessages();
    }
  }, [receiverId, senderId]);

  const sendMessage = async () => {
    if (!receiverId || !inputMessage.trim()) {
      return; // Don't send empty messages
    }

    try {
      const response = await axios.post("http://localhost:5000/api/messages/send", {
        senderId,
        receiverId,
        content: inputMessage,
      });
      setMessages([...messages, response.data.data]); // Add new message to the message list
      setInputMessage(""); // Clear input field
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="message-container">
      <div className="receiver-selector">
        <label>Select Receiver:</label>
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>

      <div className="message-box">
        {messages.map((message) => (
          <div
            key={message._id}
            className={message.sender === senderId ? "message sent" : "message received"}
          >
            <p>{message.content}</p>
            <small>{new Date(message.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="input-box">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Message;
