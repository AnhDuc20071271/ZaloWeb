// ✅ UserProfileScreen.js đầy đủ (gồm phần icon camera và upload ảnh)
import React from "react";
import "./../css/UserProfileScreen.css";
import { IoCameraOutline } from "react-icons/io5";

function UserProfileScreen({ user, onClose, onAvatarChange }) {
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="profile-overlay">
      <div className="profile-popup">
        <div className="profile-header-cover">
          <img src={user.cover || "/default-cover.jpg"} alt="Cover" />
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-avatar-section">
          <div className="avatar-wrapper">
            <img
              src={user.avatar || "/default-avatar.png"}
              className="profile-avatar"
              alt="Avatar"
            />
            <label className="camera-overlay">
              <IoCameraOutline size={22} />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>
          <h2>{user.name}</h2>
        </div>

        <div className="profile-info">
          <h3>Thông tin cá nhân</h3>
          <p><strong>Giới tính:</strong> {user.gender || "Chưa cập nhật"}</p>
          <p><strong>Ngày sinh:</strong> {user.dob || "Chưa cập nhật"}</p>
          <p><strong>Điện thoại:</strong> {user.phone}</p>
          <p className="hint">Chỉ bạn bè có lưu số mới xem được số này</p>
        </div>

        <div className="update-btn">
          <button>Cập nhật</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileScreen;