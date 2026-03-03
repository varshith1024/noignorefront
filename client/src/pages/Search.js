import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);

  const token = localStorage.getItem("token");

  const search = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/search/${username}`,
        {
          headers: { Authorization: token }
        }
      );

      setResults(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  const sendRequest = async (receiverId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/auth/send-request/${receiverId}`,
        {},
        {
          headers: { Authorization: token }
        }
      );

      alert("Friend request sent 😤");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h3>Search Users 🔍</h3>

        <input
          className="form-control mb-3"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <button className="btn btn-primary" onClick={search}>
          Search
        </button>

        <ul className="list-group mt-3">
          {results.map((user) => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {user.username}
              <button
                className="btn btn-sm btn-success"
                onClick={() => sendRequest(user.id)}
              >
                Send Request
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Search;