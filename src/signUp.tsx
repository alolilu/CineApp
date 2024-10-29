import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = users.some((user: any) => user.username === username);

    if (userExists) {
      toast.error("Ce nom d'utilisateur existe déjà", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } else {
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Inscription réussie !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="signup-title">Sign Up</h2>
        <input
          type="text"
          className="signup-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="signup-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-button" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
