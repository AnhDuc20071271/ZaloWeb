import React, { useState } from "react";
import "./../css/HomeScreen.css";
import { useNavigate } from "react-router-dom";

function HomeScreen() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const navigate = useNavigate();

  // Toggle menu hồ sơ
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowSettings(false); // Đóng menu settings nếu đang mở
  };

  // Toggle menu cài đặt
  const toggleSettingsMenu = () => {
    setShowSettings(!showSettings);
    setShowProfileMenu(false); // Đóng menu hồ sơ nếu đang mở
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    navigate("/"); // Chuyển về màn hình đăng nhập
  };

  return (
    <div className="home-screen">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar item đầu tiên - Hiển thị menu hồ sơ */}
        <div className="sidebar-item" onClick={toggleProfileMenu}>
          <img src="user.png" alt="User Icon" className="sidebar-image" />
        </div>
        <div className="sidebar-item second">
          <img src="message.png" alt="Message Icon" />
        </div>
        <div className="sidebar-item third">
          <img src="contacts.png" alt="Contacts Icon" />
        </div>

        {/* Sidebar item cuối cùng - Hiển thị menu cài đặt */}
        <div className="sidebar-item bottom" onClick={toggleSettingsMenu}>
          <img src="settings.png" alt="Settings Icon" />
        </div>
      </div>

      {/* Hiển thị menu hồ sơ nếu được bật */}
      {showProfileMenu && (
        <div className="profile-menu">
          <div className="profile-header">
            <img src="user.png" alt="User Avatar" className="profile-avatar" />
            <span className="profile-name">Đức Nguyễn</span>
          </div>
          <ul className="profile-options">
            <li>
              Hồ sơ của bạn
            </li>
            <li>
              Cài đặt
            </li>
            <li className="logout" onClick={handleLogout}>
              Đăng xuất
            </li>
          </ul>
        </div>
      )}

      {/* Hiển thị menu cài đặt nếu được bật */}
      {showSettings && (
        <div className="settings-menu">
          <ul>
            <li>
              Thông tin tài khoản
            </li>
            <li>
              Cài đặt
            </li>
            <li className="logout" onClick={handleLogout}>
              Đăng xuất
            </li>
          </ul>
        </div>
      )}

      {/* Message List */}
      <div className="message-list">
        <div className="search-container">
          <div className="search-bar">
            <img src="search.png" alt="Search Icon" className="search-icon" />
            <span className="search-text">Tìm Kiếm</span>
          </div>
          <div className="add-friend">
            <img src="addfriend.png" alt="Add Friend" className="add-friend-icon" />
          </div>
          <div className="add-group">
            <img src="addgroup.jpg" alt="Add Group" className="add-group-icon" />
          </div>
        </div>
        <div className="message-tabs">
          <span 
            className={`tab ${activeTab === "Tất cả" ? "active" : ""}`} 
            onClick={() => setActiveTab("Tất cả")}
          >
            Tất cả
          </span>
          <span 
            className={`tab ${activeTab === "Chưa đọc" ? "active" : ""}`} 
            onClick={() => setActiveTab("Chưa đọc")}
          >
            Chưa đọc
          </span>
          <span 
            className={`tab ${activeTab === "Phân loại" ? "active" : ""}`} 
            onClick={() => setActiveTab("Phân loại")}
          >
            Phân loại ▼
          </span>
          <span className="tab more">⋯</span>
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
        <p>Nhấn tin nhiều hơn, soạn thảo ít hơn</p>
      </div>
    </div>
  );
}

export default HomeScreen;
