import React from "react";
import "./../css/HomeScreen.css";

function HomeScreen() {
  return (
    <div className="home-screen">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-item">
          <img src="user.png" alt="Slide Bar 1" className="sidebar-image" />
        </div>
        <div className="sidebar-item second">
          <img src="message.png" alt="Message Icon" />
        </div>
        <div className="sidebar-item third">
          <img src="contacts.png" alt="Contacts Icon" />
        </div>

        {/* Sidebar item mới ở dưới cùng */}
        <div className="sidebar-item bottom">
          <img src="settings.png" alt="Settings Icon" />
        </div>
      </div>

      {/* Message List */}
      <div className="message-list">
        {/* Thanh tìm kiếm và nút Add Friend */}
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
