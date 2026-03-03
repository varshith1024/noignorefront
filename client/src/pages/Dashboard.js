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

  /* =========================
     JOIN SOCKET ROOM
  ========================== */
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
     FETCH REQUESTS
  ========================== */
  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://noignore.onrender.com/api/auth/pending-requests",
        {
          headers: { Authorization: token }
        }
      );
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  /* =========================
     FETCH FRIENDS
  ========================== */
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
  }, [token]);

  useEffect(() => {
    fetchRequests();
    fetchFriends();
  }, [fetchRequests, fetchFriends]);

  /* =========================
     ACCEPT REQUEST
  ========================== */
  const acceptRequest = async (id) => {
    try {
      await axios.post(
        `https://noignore.onrender.com/api/auth/accept-request/${id}`,
        {},
        {
          headers: { Authorization: token }
        }
      );

      setNotification("Friend request accepted 😤");

      fetchRequests();
      fetchFriends();
    } catch (err) {
      setNotification("Failed to accept request ❌");
    }
  };

  /* =========================
     LOGOUT
  ========================== */
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

        <div className="mb-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/search")}
          >
            Search Users
          </button>

          <button
            className="btn btn-danger"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <hr />

        {/* ================= Pending Requests ================= */}
        <h5>Pending Friend Requests</h5>

        {requests.length === 0 && (
          <p className="text-muted">No pending requests</p>
        )}

        <ul className="list-group mb-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {req.sender.username}
              <button
                className="btn btn-success btn-sm"
                onClick={() => acceptRequest(req.id)}
              >
                Accept
              </button>
            </li>
          ))}
        </ul>

        <hr />

        {/* ================= Friends ================= */}
        <h5>Your Friends</h5>

        {friends.length === 0 && (
          <p className="text-muted">No friends yet</p>
        )}

        <ul className="list-group">
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="list-group-item d-flex justify-content-between align-items-center"
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