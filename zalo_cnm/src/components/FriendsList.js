// components/FriendsList.js
import React from "react";
import "./../css/FriendsList.css";

const groupByFirstLetter = (friends) => {
  const grouped = {};
  friends.forEach((friend) => {
    const firstLetter = (friend.name || "?")[0].toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(friend);
  });
  return grouped;
};

export default function FriendsList({ friends }) {
  const grouped = groupByFirstLetter(friends);

  return (
    <div className="friends-list-container">
      {Object.keys(grouped).sort().map((letter) => (
        <div key={letter} className="friend-group">
          <h4 className="letter-header">{letter}</h4>
          {grouped[letter].map((f) => (
            <div key={f.phone} className="friend-item">
              <img src={f.avatar || "/default-avatar.png"} alt="avatar" className="friend-avatar" />
              <div className="friend-info">
                <p className="friend-name">{f.name}</p>
                <p className="friend-phone">{f.phone}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
