import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileScreen from "./UserProfileScreen";
import "./../css/HomeScreen.css";

function HomeScreen() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const phone = sessionStorage.getItem("phone");
    if (!phone) {
      navigate("/");
      return;
    }

    const encodedPhone = encodeURIComponent(phone); // encode +84 thành %2B84
    axios
      .get(`http://localhost:5000/api/auth/${encodedPhone}`)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy user:", err);
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("phone");
    navigate("/");
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowSettings(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettings(!showSettings);
    setShowProfileMenu(false);
  };

  const messages = [
    { id: 1, name: "Nguyễn Bảo Thành", lastMessage: "ờ", date: "19/02", avatar: "avatar1.jpg" },
    { id: 2, name: "Nguyên Đai", lastMessage: "ok", date: "18/02", avatar: "avatar2.png" },
    { id: 3, name: "Phạm Xuân Thức", lastMessage: "[Thiệp] Gửi lời chào", date: "18/02", avatar: "avatar3.png" },
    { id: 4, name: "Nguyễn Duy Bảo", lastMessage: "uk", date: "13/01", avatar: "avatar4.jpg" },
  ];

  return (
    <div className="home-screen">
      <Sidebar
        activePage="messages"
        onToggleProfile={toggleProfileMenu}
        onToggleSettings={toggleSettingsMenu}
      />

      {/* Hồ sơ menu */}
      {showProfileMenu && user && (
        <div className="profile-menu">
          <div className="profile-header">
            <img src={user.avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
            <span className="profile-name">{user.name || "Người dùng"}</span>
          </div>
          <ul className="profile-options">
            <li onClick={() => setShowProfile(true)}>Hồ sơ của bạn</li>
            <li>Cài đặt</li>
            <li className="logout" onClick={handleLogout}>Đăng xuất</li>
          </ul>
        </div>
      )}

      {/* Cài đặt menu */}
      {showSettings && (
        <div className="settings-menu">
          <ul>
            <li>Thông tin tài khoản</li>
            <li>Cài đặt</li>
            <li className="logout" onClick={handleLogout}>Đăng xuất</li>
          </ul>
        </div>
      )}

      {/* Hồ sơ popup */}
      {showProfile && user && (
        <UserProfileScreen user={user} onClose={() => setShowProfile(false)} />
      )}

      {/* Danh sách tin nhắn */}
      <div className="message-list">
        <div className="search-container">
          <div className="search-bar">
            <img src="search.png" alt="Search Icon" className="search-icon" />
            <span className="search-text">Tìm Kiếm</span>
          </div>
        </div>

        <div className="message-tabs">
          <span className={`tab ${activeTab === "Tất cả" ? "active" : ""}`} onClick={() => setActiveTab("Tất cả")}>Tất cả</span>
          <span className={`tab ${activeTab === "Chưa đọc" ? "active" : ""}`} onClick={() => setActiveTab("Chưa đọc")}>Chưa đọc</span>
          <span className={`tab ${activeTab === "Phân loại" ? "active" : ""}`} onClick={() => setActiveTab("Phân loại")}>Phân loại ▼</span>
          <span className="tab more">&hellip;</span>
        </div>

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

      {/* Màn hình chào mừng */}
      <div className="welcome-screen">
        <h1>Chào mừng đến với Zalo PC!</h1>
        <p>Khám phá tiện ích hỗ trợ làm việc và trò chuyện cùng bạn bè.</p>
        <img
          src="https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png"
          alt="Welcome"
        />
        <p>Nhắn tin nhiều hơn, soạn thảo ít hơn</p>
      </div>
    </div>
  );
}

export default HomeScreen;
