import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import UserProfileScreen from "./UserProfileScreen";
import "./../css/HomeScreen.css";

function HomeScreen() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const messages = [
    { id: 1, name: "Nguyễn Bảo Thành", lastMessage: "ờ", date: "19/02", avatar: "avatar1.jpg" },
    { id: 2, name: "Nguyên Đai", lastMessage: "ok", date: "18/02", avatar: "avatar2.png" },
    { id: 3, name: "Phạm Xuân Thức", lastMessage: "[Thiệp] Gửi lời chào", date: "18/02", avatar: "avatar3.png" },
    { id: 4, name: "Nguyễn Duy Bảo", lastMessage: "uk", date: "13/01", avatar: "avatar4.jpg" },
  ];

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowSettings(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettings(!showSettings);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    navigate("/"); // quay về trang đăng nhập
  };

  return (
    <div className="home-screen">
      {/* Sidebar */}
      <Sidebar activePage="messages" onToggleProfile={toggleProfileMenu} onToggleSettings={toggleSettingsMenu} />

      {/* Menu hồ sơ */}
      {showProfileMenu && (
        <div className="profile-menu">
          <div className="profile-header">
            <img src="user.png" alt="User Avatar" className="profile-avatar" />
            <span className="profile-name">Đức Nguyễn</span>
          </div>
          <ul className="profile-options">
            <li onClick={() => setShowProfile(true)}>Hồ sơ của bạn</li>
            <li>Cài đặt</li>
            <li className="logout" onClick={handleLogout}>Đăng xuất</li>
          </ul>
        </div>
      )}

      {/* Menu cài đặt */}
      {showSettings && (
        <div className="settings-menu">
          <ul>
            <li>Thông tin tài khoản</li>
            <li>Cài đặt</li>
            <li className="logout" onClick={handleLogout}>Đăng xuất</li>
          </ul>
        </div>
      )}

      {/* Giao diện hồ sơ */}
      {showProfile && (
        <UserProfileScreen
          user={{
            name: "Đức Nguyễn",
            phone: "+84 357 695 485",
            gender: "Nam",
            dob: "06 tháng 09, 2002",
            avatar: "/user.png",
            cover: "/cover.jpg"
          }}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Danh sách tin nhắn */}
      <div className="message-list">
        <div className="search-container">
          <div className="search-bar">
            <img src="search.png" alt="Search Icon" className="search-icon" />
            <span className="search-text">Tìm Kiếm</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="message-tabs">
          <span className={`tab ${activeTab === "Tất cả" ? "active" : ""}`} onClick={() => setActiveTab("Tất cả")}>Tất cả</span>
          <span className={`tab ${activeTab === "Chưa đọc" ? "active" : ""}`} onClick={() => setActiveTab("Chưa đọc")}>Chưa đọc</span>
          <span className={`tab ${activeTab === "Phân loại" ? "active" : ""}`} onClick={() => setActiveTab("Phân loại")}>Phân loại ▼</span>
          <span className="tab more">&hellip;</span>
        </div>

        {/* Danh sách tin nhắn */}
        <div className="chat-list">
          {messages.map((msg) => (
            <div className="chat-item" key={msg.id}>
              <img src={msg.avatar} alt={msg.name} className="chat-avatar" />
              <div className="chat-info">
                <div className="chat-header">
                  <span className="chat-name">{msg.name}</span>
                  <span className="chat-date">{msg.date}</span>
                </div>
                <span className="chat-last-message">{msg.lastMessage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome Screen */}
      <div className="welcome-screen">
        <h1>Chào mừng đến với Zalo PC!</h1>
        <p>
          Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè để được tối ưu hóa cho máy tính của bạn.
        </p>
        <img
          src="https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png"
          alt="Welcome Illustration"
        />
        <p>Nhắn tin nhiều hơn, soạn thảo ít hơn</p>
      </div>
    </div>
  );
}

export default HomeScreen;