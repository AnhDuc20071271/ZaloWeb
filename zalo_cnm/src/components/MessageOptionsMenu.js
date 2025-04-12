import React from "react";
import "./../css/MessageOptionsMenu.css";

export default function MessageOptionsMenu({ onRecall, onDelete }) {
  return (
    <div className="message-options-popup">
      <div className="menu-item" onClick={onRecall}>🔁 Thu hồi tin nhắn</div>
      <div className="menu-item" onClick={onDelete}>🗑️ Xóa chỉ ở phía tôi</div>
    </div>
  );
}
