import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileScreen from "./UserProfileScreen";
import AddFriendModal from "../components/AddFriendModal";
import ChatWindow from "../components/ChatWindow";
import "./../css/HomeScreen.css";

function HomeScreen() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [showProfile, setShowProfile] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const navigate = useNavigate();

  const normalizePhone = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("+84")) return phone.replace("+84", "84");
    if (phone.startsWith("0")) return phone.replace(/^0/, "84");
    return phone;
  };

  useEffect(() => {
    const phone = sessionStorage.getItem("phone");
    if (!phone) {
      navigate("/");
      return;
    }

    const normalizedPhone = normalizePhone(phone);
    axios
      .get(`http://localhost:5000/api/auth/${normalizedPhone}`)
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

  useEffect(() => {
    const fetchMessages = async () => {
      const phone = sessionStorage.getItem("phone");
      const normalizedPhone = normalizePhone(phone);

      if (!normalizedPhone) return;

      try {
        const friendsRes = await axios.get(`http://localhost:5000/api/friends/list/${normalizedPhone}`);
        const friends = friendsRes.data.friends || [];

        const fakeMessages = friends.map((friend, index) => ({
          id: index + 1,
          name: friend.name,
          phone: friend.phone,
          lastMessage: "Hãy bắt đầu trò chuyện!",
          date: new Date().toLocaleDateString("vi-VN"),
          avatar: friend.avatar || "/default-avatar.png",
        }));

        setMessages(fakeMessages);
      } catch (err) {
        console.error("❌ Lỗi lấy bạn bè cho message:", err);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="home-screen">
      <Sidebar
        activePage="messages"
        onToggleProfile={toggleProfileMenu}
        onToggleSettings={toggleSettingsMenu}
      />

      {showProfileMenu && user && (
        <div className="profile-menu">
          <div className="profile-header">
            <img src={user.avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
            <span className="profile-name">{user.name || "Người dùng"}</span>
          </div>
          <ul className="profile-options">
            <li onClick={() => setShowProfile(true)}>Ồ sơ của bạn</li>
            <li>Cài đặt</li>
            <li className="logout" onClick={handleLogout}> Đăng xuất</li>
          </ul>
        </div>
      )}

      {showSettings && (
        <div className="settings-menu">
          <ul>
            <li>Thông tin tài khoản</li>
            <li>Cài đặt</li>
            <li className="logout" onClick={handleLogout}> Đăng xuất</li>
          </ul>
        </div>
      )}

      {showProfile && user && (
        <UserProfileScreen user={user} onClose={() => setShowProfile(false)} />
      )}

      <div className="message-list">
        <div className="search-container">
          <div className="search-bar">
            <img src="search.png" alt="Search Icon" className="search-icon" />
            <span className="search-text">Tìm Kiếm</span>
          </div>

          <div className="action-icons">
            <img
              src="/addfriend.png"
              alt="Thêm bạn"
              className="action-icon"
              title="Thêm bạn"
              onClick={() => setShowAddFriend(true)}
            />
            <img
              src="/addgroup.jpg"
              alt="Tạo nhóm"
              className="action-icon"
              title="Tạo nhóm"
              onClick={() => alert("Chức năng Tạo nhóm đang phát triển")}
            />
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
            <div
              className="chat-item"
              key={msg.id}
              onClick={() => setSelectedFriend(msg)}
            >
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

      {showAddFriend && (
        <AddFriendModal
          currentUserPhone={user?.phone}
          onClose={() => setShowAddFriend(false)}
        />
      )}

      {!selectedFriend && (
        <div className="welcome-screen">
          <h1>Chào mừng đến với Zalo PC!</h1>
          <p>Khám phá tiện ích hỗ trợ làm việc và trò chuyện cùng bạn bè.</p>
          <img
            src="https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png"
            alt="Welcome"
          />
          <p>Nhắn tin nhiều hơn, soạn thảo ít hơn</p>
        </div>
      )}

      {selectedFriend && (
        <ChatWindow
          selectedFriend={selectedFriend}
          currentUser={user}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  );
}

export default HomeScreen;