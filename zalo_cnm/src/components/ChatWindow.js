import React, { useEffect, useRef, useState } from "react";
import "./../css/ChatWindow.css";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import MessageOptionsMenu from "./MessageOptionsMenu";
import ShareMessageModal from "./ShareMessageModal";

const socket = io("http://localhost:5000");

const normalizePhone = (phone) => {
  if (!phone) return "";
  return phone.startsWith("0") ? "84" + phone.slice(1) : phone;
};

export default function ChatWindow({ selectedFriend, currentUser, onClose }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMsgIndex, setHoveredMsgIndex] = useState(null);
  const [selectedMsgIndex, setSelectedMsgIndex] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState(null);
  
  const chatContentRef = useRef();
  const emojiButtonRef = useRef();
  const fileInputRef = useRef();

  const currentPhone = normalizePhone(currentUser?.phone);
  const friendPhone = normalizePhone(selectedFriend?.phone);

  const storageKey = `deleted-${currentPhone}-${friendPhone}`;

  useEffect(() => {
    if (!currentPhone || !friendPhone) return;
    fetch(`http://localhost:5000/api/messages?userA=${currentPhone}&userB=${friendPhone}`)
      .then((res) => res.json())
      .then((data) => setChatMessages(data.messages || []));
  }, [currentPhone, friendPhone]);

  useEffect(() => {
    const handleReceive = (data) => {
      if (data.type === "recall") {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === data.timestamp ? { ...msg, message: "__RECALLED__", type: "recall" } : msg
          )
        );
      } else if (
        (data.from === friendPhone && data.to === currentPhone) ||
        (data.from === currentPhone && data.to === friendPhone)
      ) {
        setChatMessages((prev) => [...prev, data]);
      }
    };
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [currentPhone, friendPhone]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
    setDeletedMessages(stored);
  }, [storageKey]);

  const handleSend = () => {
    if (!message.trim()) return;
    const msg = {
      from: currentPhone,
      to: friendPhone,
      message,
      timestamp: Date.now(),
    };
    socket.emit("send_message", msg);
    setMessage("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 10 * 1024 * 1024) {
      alert("File phải nhỏ hơn 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("from", currentPhone);
    formData.append("to", friendPhone);

    try {
      const res = await fetch("http://localhost:5000/api/messages/send-file", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) alert("Gửi file thất bại.");
    } catch (err) {
      alert("Lỗi gửi file.");
    }

    e.target.value = "";
  };

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    const handleClickOutside = () => setMenuPosition(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDeleteForMe = () => {
    const updated = [...deletedMessages, selectedMsgIndex];
    setDeletedMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setMenuPosition(null);
  };

  const handleRecallMessage = async () => {
    const msg = chatMessages[selectedMsgIndex];
    try {
      const res = await fetch("http://localhost:5000/api/messages/recall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: msg.from, to: msg.to, timestamp: msg.timestamp }),
      });

      const result = await res.json();
      if (result.success) {
        socket.emit("recall_message", {
          from: msg.from,
          to: msg.to,
          timestamp: msg.timestamp,
        });
      }
    } catch (err) {
      console.error("Recall error:", err);
    }
    setMenuPosition(null);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">Chat với {selectedFriend.name}</div>

      <div className="chat-content chat-messages" ref={chatContentRef}>
        {chatMessages.length === 0 ? (
          <p className="empty-message">Chưa có tin nhắn nào.</p>
        ) : (
          chatMessages.map((msg, idx) => {
            if (deletedMessages.includes(idx)) return null;
            const isSent = msg.from === currentPhone;
            const isRecalled = msg.message === "__RECALLED__";
            return (
              <div
                key={idx}
                className={`chat-bubble-wrapper ${isSent ? "sent" : "received"}`}
                onMouseEnter={() => setHoveredMsgIndex(idx)}
                onMouseLeave={() => setHoveredMsgIndex(null)}
              >
                <div className="chat-bubble">
                  {isRecalled ? (
                    <i>Tin nhắn đã thu hồi</i>
                  ) : msg.type === "file" ? (
                    <a href={`http://localhost:5000${msg.url}`} target="_blank" rel="noopener noreferrer">
                      📎 {msg.message}
                    </a>
                  ) : (
                    msg.message
                  )}
                </div>

                {!isRecalled && hoveredMsgIndex === idx && (
                  <div className="chat-hover-icons">
                    <img src="/reply.png" alt="reply" title="Trả lời" />
                    <img
                            src="/share.png"
                            alt="share"
                            title="Chia sẻ"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMsgIndex(idx);
                                setShareMessage(msg);
                                setShowShareModal(true);
                            }}
                            />
                    <img
                      src="/more.png"
                      alt="more"
                      title="Thêm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMsgIndex(idx);
                        setMenuPosition({ x: e.clientX, y: e.clientY });
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {menuPosition && (
        <div
          className="message-options-popup-wrapper"
          style={{
            top: menuPosition.y,
            left: menuPosition.x - 190,
            position: "absolute",
            zIndex: 999,
          }}
        >
          <MessageOptionsMenu
            onRecall={handleRecallMessage}
            onDelete={handleDeleteForMe}
          />
        </div>
      )}

      {showEmojiPicker && emojiButtonRef.current && (
        <div
          style={{
            position: "absolute",
            top: emojiButtonRef.current.getBoundingClientRect().top - 370,
            left: emojiButtonRef.current.getBoundingClientRect().left,
            zIndex: 999,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
        </div>
      )}
                {showShareModal && shareMessage && (
                <ShareMessageModal
                    currentUser={currentUser}
                    onClose={() => setShowShareModal(false)}
                    messageToShare={shareMessage}
                />
                )}
      <div className="chat-input-bar">
        <div className="chat-input-left">
          <img
            ref={emojiButtonRef}
            src="/emoji.png"
            alt="Emoji"
            className="chat-input-icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          <img
            src="/image.png"
            alt="Ảnh"
            className="chat-input-icon"
            onClick={() => fileInputRef.current.click()}
          />
          <img
            src="/file.png"
            alt="File"
            className="chat-input-icon"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <input
          type="text"
          className="chat-input"
          placeholder={`Nhập tin nhắn tới ${selectedFriend.name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="chat-input-right">
          <img
            src="/send.png"
            alt="Gửi"
            className="chat-input-icon"
            onClick={handleSend}
            title="Gửi tin nhắn"
          />
        </div>
      </div>
    </div>
  );
}