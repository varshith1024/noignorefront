import React, { useEffect, useRef, useCallback, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";

function Chat() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const userId = JSON.parse(atob(token.split(".")[1])).userId;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  /* =========================
     JOIN ROOM
  ========================== */
  useEffect(() => {
    socket.emit("join", userId);

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  /* =========================
     RECEIVE MESSAGE
  ========================== */
  useEffect(() => {
    const handleReceive = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, []);

  /* =========================
     FETCH OLD MESSAGES
  ========================== */
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(
        `https://noignore.onrender.com/api/auth/messages/${friendId}`,
        {
          headers: { Authorization: token }
        }
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [friendId, token]);   // ✅ REQUIRED

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /* =========================
     AUTO SCROLL
  ========================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================== */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `https://noignore.onrender.com/api/auth/send-message/${friendId}`,
        { content: newMessage },
        {
          headers: { Authorization: token }
        }
      );

      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: friendId,
        content: newMessage
      });

      setMessages((prev) => [
        ...prev,
        { senderId: userId, content: newMessage }
      ]);

      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h4 className="mb-3">Real-Time Chat 😤</h4>

        <div style={{ height: "350px", overflowY: "auto" }}>
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span
                className={`badge ${
                  msg.senderId === userId
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <div className="d-flex mt-3">
          <input
            className="form-control me-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>

        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Chat;