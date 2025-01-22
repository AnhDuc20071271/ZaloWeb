import React, { useState } from "react";
import "./../css/ContactsScreen.css";

function ContactsScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  // Danh sách bạn bè mẫu
  const friends = [
    { id: 1, name: "Black Bear", avatar: "blackbear.png" },
    { id: 2, name: "Cao Tiến Hoàng", avatar: "caotienhoang.png" },
  ];

  // Lọc danh sách bạn bè theo tìm kiếm
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Nhóm bạn bè theo chữ cái đầu
  const groupedFriends = filteredFriends.reduce((acc, friend) => {
    const firstLetter = friend.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(friend);
    return acc;
  }, {});

  return (
    <div className="contacts-screen">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-item">
          <img src="user.png" alt="User Icon" className="sidebar-image" />
        </div>
        <div className="sidebar-item second">
          <img src="message.png" alt="Message Icon" />
        </div>
        <div className="sidebar-item third active">
          <img src="contacts.png" alt="Contacts Icon" />
        </div>
        <div className="sidebar-item bottom">
          <img src="settings.png" alt="Settings Icon" />
        </div>
      </div>

      {/* Phần danh sách bên trái (Menu danh bạ) */}
      <div className="contacts-menu">
        <div className="contacts-menu-search">
          <input type="text" placeholder="Tìm kiếm" className="contacts-menu-input" />
          <img src="addfriend.png" alt="Search" className="contacts-menu-icon" />
          <img src="addgroup.jpg" alt="Add Friend" className="contacts-menu-icon" />
        </div>
        <ul className="contacts-menu-list">
          <li className="contacts-menu-item active">📂 Danh sách bạn bè</li>
          <li className="contacts-menu-item">👥 Danh sách nhóm và cộng đồng</li>
          <li className="contacts-menu-item">➕ Lời mời kết bạn</li>
          <li className="contacts-menu-item">📩 Lời mời vào nhóm và cộng đồng</li>
        </ul>
      </div>

      {/* Phần danh sách bạn bè */}
      <div className="contacts-container">
        {/* Thanh tiêu đề */}
        <div className="contacts-header">
          <h2>Danh sách bạn bè</h2>
        </div>

        {/* Thanh tìm kiếm + Bộ lọc */}
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

        {/* Danh sách bạn bè */}
        <div className="contacts-list">
          {Object.keys(groupedFriends).map((letter) => (
            <div key={letter} className="contacts-group">
              <h3 className="contacts-group-title">{letter}</h3>
              {groupedFriends[letter].map((friend) => (
                <div key={friend.id} className="contacts-friend">
                  <img src={`/assets/${friend.avatar}`} alt={friend.name} className="contacts-avatar" />
                  <span className="contacts-name">{friend.name}</span>
                  <button className="contacts-options">⋯</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactsScreen;
