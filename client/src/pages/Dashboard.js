import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import ToastNotification from "../components/ToastNotification";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [notification, setNotification] = useState("");

  const userId = JSON.parse(atob(token.split(".")[1])).userId;

  useEffect(() => {
    socket.emit("join", userId);

    const handleIgnore = (data) => {
      setNotification(data.message);
    };

    socket.on("ignoreWarning", handleIgnore);

    return () => {
      socket.off("ignoreWarning", handleIgnore);
    };
  }, [userId]);

  /* =========================
     FETCH DATA
  ========================== */
  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://noignore.onrender.com/api/auth/pending-requests", // ✅ FIXED
        {
          headers: { Authorization: token }
        }
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);   // ✅ REQUIRED

  const fetchFriends = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://noignore.onrender.com/api/auth/friends",
        {
          headers: { Authorization: token }
        }
      );
      setFriends(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);   // ✅ REQUIRED

  useEffect(() => {
    fetchRequests();
    fetchFriends();
  }, [fetchRequests, fetchFriends]);

  const logout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <ToastNotification message={notification} />

      <div className="card p-4 shadow">
        <h3 className="mb-3">Welcome to NoIgnore 😤</h3>

        <button className="btn btn-danger mb-3" onClick={logout}>
          Logout
        </button>

        <h5>Your Friends</h5>
        <ul className="list-group">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="list-group-item d-flex justify-content-between"
            >
              {friend.username}
              <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate(`/chat/${friend.id}`)}
              >
                Chat
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;