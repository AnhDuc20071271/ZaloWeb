import React, { useState } from "react";
import "./../css/AddFriendModal.css";
import axios from "axios";

function AddFriendModal({ onClose, currentUserPhone }) {
  const [targetPhone, setTargetPhone] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");

  const normalizePhone = (phone) =>
    phone?.startsWith("+84") ? phone : phone?.replace(/^0/, "+84");

  const isValidPhone = (phone) => /^0\d{9}$/.test(phone);

  const handleSearch = async () => {
    setFoundUser(null);
    setError("");

    if (!isValidPhone(targetPhone)) {
      setError("Số điện thoại không hợp lệ (VD: 035xxxxxxx)");
      return;
    }

    const normalizedTarget = normalizePhone(targetPhone);
    const normalizedCurrent = normalizePhone(currentUserPhone);

    if (normalizedTarget === normalizedCurrent) {
      setError("Không thể tìm chính mình");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/${encodeURIComponent(normalizedTarget)}`
      );
      if (res.data.success) {
        setFoundUser(res.data.user);
      } else {
        setError("Không tìm thấy người dùng");
      }
    } catch (err) {
      setError("Không tìm thấy người dùng");
    }
  };

  const handleSendRequest = async () => {
    try {
      await axios.post("http://localhost:5000/api/friends/request", {
        from: normalizePhone(currentUserPhone),
        to: normalizePhone(targetPhone),
      });
      alert("Đã gửi lời mời kết bạn");
      onClose();
    } catch (err) {
      alert("Không thể gửi lời mời kết bạn");
    }
  };

  return (
    <div className="add-friend-overlay" onClick={onClose}>
      <div className="add-friend-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm bạn</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* ✅ Kết quả tìm kiếm nếu có */}
        {foundUser && (
          <div className="found-user">
            <img
              src={foundUser.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="avatar"
            />
            <div className="info">
              <p>{foundUser.name}</p>
              <button className="add-btn" onClick={handleSendRequest}>
                Kết bạn
              </button>
            </div>
          </div>
        )}

        {/* ✅ Hiển thị lỗi nếu có */}
        {error && <p className="error-text" style={{ color: "red" }}>{error}</p>}

        {/* ✅ Form nhập SĐT và nút */}
        <input
          type="text"
          className="input-phone"
          placeholder="Nhập số điện thoại (VD: 035xxxxxxx)"
          value={targetPhone}
          onChange={(e) => setTargetPhone(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Tìm kiếm
        </button>
        <button className="search-btn" onClick={onClose}>
          Huỷ
        </button>
      </div>
    </div>
  );
}

export default AddFriendModal;
