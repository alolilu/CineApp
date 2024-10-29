import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    if (loggedInUser) {
      setUsername(loggedInUser.username || "");
      setEmail(loggedInUser.email || "");
      setPassword(loggedInUser.password || "");
    }
    setLoading(false);
  }, []);

  const handleUpdate = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: any) =>
      user.username === username ? { ...user, username, email, password } : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ username, email, password })
    );

    toast.success("Profil mis à jour avec succès", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">Mon Profil</h2>
        <div className="profile-field">
          <label className="profile-label">Nom d'utilisateur</label>
          <input
            className="profile-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Email</label>
          <input
            className="profile-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Mot de passe</label>
          <input
            className="profile-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="profile-button" onClick={handleUpdate}>
          Mettre à jour
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
