import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Chat from "./pages/Chat";

import PrivateRoute from "./components/PrivateRoute";
import socket from "./socket";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  /* =========================
     🔓 UNLOCK AUDIO ON FIRST CLICK
  ========================== */
  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio("/bla.mp3");
      audio.play().catch(() => {});
    };

    window.addEventListener("click", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);


  /* =========================
     🔔 GLOBAL IGNORE LISTENER
  ========================== */
  useEffect(() => {

    socket.on("ignoreWarning", (data) => {

      // 🔊 Play notification sound
      const audio = new Audio("/bla.mp3");
      audio.play().catch(() => {});

      // 🔔 Show toast notification
      toast.warning(data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

    });

    return () => {
      socket.off("ignoreWarning");
    };

  }, []);


  return (
    <>
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />

          <Route
            path="/chat/:friendId"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>

      {/* Toast container */}
      <ToastContainer />
    </>
  );
}

export default App;