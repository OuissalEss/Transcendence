import React from "react";
import friend1 from '../../../public/assets/Avatars/02.jpeg';
import friend2 from '../../../public/assets/Avatars/03.jpeg';
import friend3 from '../../../public/assets/Avatars/14.png';
import friend4 from '../../../public/assets/Avatars/18.png';
import test from '../../../public/assets/Avatars/06.png'
import './friendsBar.css';

function FriendsBar() {
  const friendsItems = [
    { name: "Stella", icon: friend1, status: "ONLINE" },
    { name: "Slan", icon: friend2, status: "OFFLINE" },
    { name: "James", icon: friend3, status: "INGAME" },
    { name: "Jinxx", icon: friend4, status: "AWAY" },
  ];

  return (
    <div className="friends-sidebar fixed z-10">
      <div className="friends-sidebar__container items-center z-10">
      <div className="friends-sidebar__top z-10">
		    <img src={test} alt="test" className="rounded-full" />
	    </div>
        <ul className="friends-sidebar__list">
          {friendsItems.map((item, index) => (
            <li className="friends-sidebar__item" key={index}>
              <img className="w-16 h-16 rounded-full" src={item.icon} alt={item.name} />
              <span className={`status-indicator ${getStatusColor(item.status)}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Function to determine status color
function getStatusColor(status: string) {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "OFFLINE":
      return "bg-red-500";
    case "AWAY":
      return "bg-yellow-500";
    case "INGAME":
      return "bg-blue-500";
    default:
      return "";
  }
}

export default FriendsBar;
