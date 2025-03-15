import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./../css/Sidebar.css";

function Sidebar({ activePage, onToggleProfile, onToggleSettings }) {
  const navigate = useNavigate(); // Thêm dòng này để tránh lỗi "navigate is not defined"

  return (
    <div className="sidebar">
      <div className={`sidebar-item ${activePage === "profile" ? "active" : ""}`} onClick={onToggleProfile}>
        <img src="user.png" alt="User Icon" className="sidebar-image" />
      </div>
      <div className={`sidebar-item second ${activePage === "messages" ? "active" : ""}`} onClick={() => navigate("/home")}>
        <img src="message.png" alt="Message Icon" />
      </div>
      <div className={`sidebar-item third ${activePage === "contacts" ? "active" : ""}`} onClick={() => navigate("/contacts")}>
        <img src="contacts.png" alt="Contacts Icon" />
      </div>
      <div className={`sidebar-item bottom ${activePage === "settings" ? "active" : ""}`} onClick={onToggleSettings}>
        <img src="settings.png" alt="Settings Icon" />
      </div>
    </div>
  );
}

export default Sidebar;
