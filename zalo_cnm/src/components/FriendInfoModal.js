import React from "react";
import "./../css/FriendInfoModal.css";
import FriendInfoModal from "../components/FriendInfoModal";

const [friendInfo, setFriendInfo] = useState(null);

const handleSearch = async () => {
  const formattedPhone = phone.startsWith("0") ? phone.replace(/^0/, "84") : phone;
  try {
    const res = await axios.get(`http://localhost:5000/api/auth/${formattedPhone}`);
    if (res.data.success) {
      setFriendInfo(res.data.user);
    } else {
      alert("Không tìm thấy người dùng");
    }
  } catch (err) {
    alert("Không tìm thấy người dùng");
  }
};

function FriendInfoModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="friend-modal-overlay" onClick={onClose}>
      <div className="friend-modal" onClick={(e) => e.stopPropagation()}>
        {/* Ảnh bìa */}
        <div className="friend-cover">
          <img
            src={user.cover || "/default-cover.jpg"}
            alt="cover"
            className="friend-cover-img"
          />
        </div>

        {/* Avatar + tên */}
        <div className="friend-info">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="avatar"
            className="friend-avatar"
          />
          <h2 className="friend-name">{user.name}</h2>
        </div>

        {/* Nút hành động */}
        <div className="friend-actions">
          <button className="btn btn-primary">Kết bạn</button>
          <button className="btn">Nhắn tin</button>
        </div>

        {/* Thông tin bổ sung nếu cần */}
        <div className="friend-more">
          <p>📁 Nhóm chung (1)</p>
          <p>🔗 Chia sẻ danh thiếp</p>
        </div>
      </div>
    </div>
  );
}

export default FriendInfoModal;
