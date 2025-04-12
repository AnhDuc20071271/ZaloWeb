import React from "react";
import "./../css/FriendRequestsPanel.css";

export default function FriendRequestsPanel({
  receivedRequests = [],
  sentRequests = [],
  onAccept,
  onReject,
  onCancel,
}) {
  return (
    <div className="friend-requests-container">
      {/* --- Lời mời đã nhận --- */}
      <h3 className="request-section-title">
        Lời mời đã nhận ({receivedRequests.length})
      </h3>

      {receivedRequests.length === 0 ? (
        <p className="empty-text">Không có lời mời nào</p>
      ) : (
        <div className="received-list">
          {receivedRequests.map((req) => (
            <div key={req.requestId} className="request-card">
              <img
                src={req.fromUser?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="avatar"
              />
              <div className="request-info">
                <p className="name">{req.fromUser?.name || "Người dùng"}</p>
                <p className="message">
                  Xin chào, mình là <strong>{req.fromUser?.name || "ai đó"}</strong>. Kết bạn với mình nhé!
                </p>
                <div className="actions">
                  <button
                    className="reject-btn"
                    onClick={() => onReject(req.requestId)}
                  >
                    Từ chối
                  </button>
                  <button
                    className="accept-btn"
                    onClick={() => onAccept(req.requestId)}
                  >
                    Đồng ý
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Lời mời đã gửi --- */}
      <h3 className="request-section-title">
        Lời mời đã gửi ({sentRequests.length})
      </h3>

      {sentRequests.length === 0 ? (
        <p className="empty-text">Không có lời mời đã gửi</p>
      ) : (
        <div className="sent-list">
          {sentRequests.map((req) => (
            <div key={req.requestId} className="sent-card">
              <img
                src={req.toUser?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="avatar"
              />
              <div className="sent-info">
                <p className="name">{req.toUser?.name || "Người dùng"}</p>
                <p className="status">Bạn đã gửi lời mời</p>
                <button
                  className="cancel-btn"
                  onClick={() => onCancel(req.requestId)}
                >
                  Thu hồi lời mời
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="see-more">Xem thêm</div>
    </div>
  );
}
