import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../css/ShareMessageModal.css";

export default function ShareMessageModal({ currentUser, onClose, messageToShare }) {
  const [friends, setFriends] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);

  useEffect(() => {
    if (!currentUser?.phone) return;
    axios
      .get(`http://localhost:5000/api/friends/list/${currentUser.phone}`)
      .then(res => setFriends(res.data.friends || []))
      .catch(err => console.error("❌ Lỗi lấy bạn bè:", err));
  }, [currentUser]);

  const handleToggle = (phone) => {
    setSelectedPhones(prev =>
      prev.includes(phone)
        ? prev.filter(p => p !== phone)
        : [...prev, phone]
    );
  };

  const handleShare = async () => {
    try {
      for (const toPhone of selectedPhones) {
        await axios.post("http://localhost:5000/api/messages/send", {
          from: currentUser.phone,
          to: toPhone,
          message: messageToShare.message,
          type: messageToShare.type || "text",
        });
      }
      alert("✅ Đã chia sẻ thành công!");
      onClose();
    } catch (err) {
      alert("❌ Lỗi chia sẻ!");
    }
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <h3>📤 Chia sẻ đến bạn bè</h3>
        <ul className="friend-list">
          {friends.map(friend => (
            <li key={friend.phone}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedPhones.includes(friend.phone)}
                  onChange={() => handleToggle(friend.phone)}
                />
                <img src={friend.avatar} alt="avatar" className="avatar" />
                {friend.name}
              </label>
            </li>
          ))}
        </ul>
        <div className="share-actions">
          <button onClick={handleShare}>✅ Chia sẻ</button>
          <button onClick={onClose}>❌ Hủy</button>
        </div>
      </div>
    </div>
  );
}
