import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import FriendRequestsPanel from "../components/FriendRequestsPanel";
import axios from "axios";
import "./../css/ContactsScreen.css";

function ContactsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");
  const [currentUser, setCurrentUser] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const standardizePhone = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("+84")) return phone.replace("+84", "84");
    if (phone.startsWith("0")) return phone.replace(/^0/, "84");
    return phone;
  };

  const fetchUserInfo = async (phone) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/${phone}`);
      if (res.data.success) return res.data.user;
    } catch (err) {
      console.error("❌ Lỗi lấy thông tin user:", err);
    }
    return null;
  };

  const loadFriendRequests = useCallback(async (phone) => {
    try {
      const sentRes = await axios.get(`http://localhost:5000/api/friends/request/sent/${phone}`);
      const sent = await Promise.all(
        (sentRes.data.sent || []).map(async (item) => {
          const toUser = await fetchUserInfo(item.to);
          return { ...item, toUser };
        })
      );
      setSentRequests(sent);

      const receivedRes = await axios.get(`http://localhost:5000/api/friends/request/received/${phone}`);
      const received = await Promise.all(
        (receivedRes.data.received || []).map(async (item) => {
          const fromUser = await fetchUserInfo(item.from);
          return { ...item, fromUser };
        })
      );
      setReceivedRequests(received);
    } catch (err) {
      console.error("❌ Lỗi khi tải lời mời:", err);
    }
  }, []);

  const loadFriends = useCallback(async (phone) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/friends/list/${phone}`);
      if (res.data.success) setFriendsList(res.data.friends);
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách bạn bè:", err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const rawPhone = sessionStorage.getItem("phone");
      const phone = standardizePhone(rawPhone);
      if (!phone) return;

      try {
        const userRes = await axios.get(`http://localhost:5000/api/auth/${phone}`);
        if (userRes.data.success) {
          setCurrentUser(userRes.data.user);
          await loadFriendRequests(phone);
          await loadFriends(phone);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      }
    };

    loadData();
  }, [loadFriendRequests, loadFriends]);

  const handleAccept = async (requestId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/friends/accept", { requestId });
      alert(`✅ ${res.data.message} (id: ${requestId})`);
      const phone = standardizePhone(sessionStorage.getItem("phone"));
      await loadFriendRequests(phone);
      await loadFriends(phone);
    } catch (err) {
      alert("❌ Lỗi khi đồng ý kết bạn");
      console.error(err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/reject", { requestId });
      const phone = standardizePhone(sessionStorage.getItem("phone"));
      await loadFriendRequests(phone);
    } catch (err) {
      console.error("❌ Lỗi khi từ chối:", err);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await axios.post("http://localhost:5000/api/friends/cancel", { requestId });
      const phone = standardizePhone(sessionStorage.getItem("phone"));
      await loadFriendRequests(phone);
    } catch (err) {
      console.error("❌ Lỗi khi thu hồi:", err);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowSettings(false);
  };

  const toggleSettingsMenu = () => {
    setShowSettings(!showSettings);
    setShowProfileMenu(false);
  };

  return (
    <div className="contacts-screen">
      <Sidebar
        activePage="contacts"
        onToggleProfile={toggleProfileMenu}
        onToggleSettings={toggleSettingsMenu}
      />

      {showProfileMenu && currentUser && (
        <div className="profile-menu">
          <div className="profile-header">
            <img src={currentUser.avatar || "/default-avatar.png"} alt="Avatar" className="profile-avatar" />
            <span className="profile-name">{currentUser.name}</span>
          </div>
          <ul className="profile-options">
            <li>Hồ sơ của bạn</li>
            <li>Cài đặt</li>
            <li className="logout">Đăng xuất</li>
          </ul>
        </div>
      )}

      {showSettings && (
        <div className="settings-menu">
          <ul>
            <li>Thông tin tài khoản</li>
            <li>Cài đặt</li>
            <li className="logout">Đăng xuất</li>
          </ul>
        </div>
      )}

      <div className="contacts-menu">
        <div className="contacts-menu-search">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="contacts-menu-input"
          />
          <img src="addfriend.png" alt="Search" className="contacts-menu-icon" />
          <img src="addgroup.jpg" alt="Add Group" className="contacts-menu-icon" />
        </div>
        <ul className="contacts-menu-list">
          <li className={`contacts-menu-item ${activeTab === "friends" ? "active" : ""}`} onClick={() => setActiveTab("friends")}>📂 Danh sách bạn bè</li>
          <li className={`contacts-menu-item ${activeTab === "groups" ? "active" : ""}`} onClick={() => setActiveTab("groups")}>👥 Nhóm và cộng đồng</li>
          <li className={`contacts-menu-item ${activeTab === "requests" ? "active" : ""}`} onClick={() => setActiveTab("requests")}>➕ Lời mời kết bạn</li>
          <li className="contacts-menu-item">📩 Mời vào nhóm/cộng đồng</li>
        </ul>
      </div>

      <div className="contacts-container">
        {activeTab === "friends" && (
          <>
            <div className="contacts-header">
              <h2>Danh sách bạn bè</h2>
            </div>
            <div className="contacts-toolbar">
              <input
                type="text"
                placeholder="Tìm bạn"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="contacts-search"
              />
              <button className="contacts-sort">Tên (A-Z)</button>
              <button className="contacts-filter">Tất cả</button>
            </div>
            <div className="friends-list">
              {Object.entries(
                friendsList.reduce((grouped, friend) => {
                  const letter = (friend.name?.charAt(0).toUpperCase() || "#");
                  if (!grouped[letter]) grouped[letter] = [];
                  grouped[letter].push(friend);
                  return grouped;
                }, {})
              )
                .sort()
                .map(([letter, friends]) => (
                  <div key={letter} className="friend-section">
                    <div className="friend-letter">{letter}</div>
                    {friends.map((friend) => (
                      <div key={friend.phone} className="friend-card">
                        <img src={friend.avatar || "/default-avatar.png"} alt="avatar" className="avatar" />
                        <div className="friend-info">
                          <p className="friend-name">{friend.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}

        {activeTab === "requests" && (
          <FriendRequestsPanel
            receivedRequests={receivedRequests}
            sentRequests={sentRequests}
            onAccept={handleAccept}
            onReject={handleReject}
            onCancel={handleCancel}
          />
        )}

        {activeTab === "groups" && (
          <div className="groups-container">
            <div className="contacts-header">
              <h2>Danh sách nhóm & cộng đồng</h2>
            </div>
            <div className="groups-list">
              <div className="group-item">
                <img src="/group1.png" alt="Group 1" className="group-avatar" />
                <span className="group-name">Nhóm học React</span>
              </div>
              <div className="group-item">
                <img src="/group2.png" alt="Group 2" className="group-avatar" />
                <span className="group-name">Cộng đồng Lập Trình</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactsScreen;