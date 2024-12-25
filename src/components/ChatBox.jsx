import React, { useState, useEffect } from "react";
import { db, generateId } from "../instantDB/db";

const ChatBox = ({ currentUser, selectedContact }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Fetch all messages (assuming you fetch the full list, or adjust as necessary)
    db.subscribeQuery({ messages: {} }, (resp) => {
      console.log(resp);
      if (resp.data?.messages) {
        // Filter messages based on senderId and receiverId
        const filteredMessages = resp.data.messages.filter(
          (msg) =>
            (msg.senderId === currentUser.id && msg.receiverId === selectedContact.id) ||
            (msg.senderId === selectedContact.id && msg.receiverId === currentUser.id)
        );

        // Sort the filtered messages based on timestamp
        const sortedMessages = filteredMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(sortedMessages);
      }
    });

    return () => {
      // Cleanup code if necessary (e.g., unsubscribeQuery)
    };
  }, [currentUser, selectedContact]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      db.transact(
        db.tx.messages[generateId()].update({
          senderId: currentUser.id,
          receiverId: selectedContact.id,
          text: inputValue,
          timestamp: Date.now(),
        })
      );
      setInputValue("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`${msg.senderId === currentUser.id ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-4 py-2 rounded ${
                msg.senderId === currentUser.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center space-x-2">
        <input
          className="flex-1 border px-4 py-2 rounded"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
