import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from '../../../public/assets/Icons/Home.png';
import GameIcon from '../../../public/assets/Icons/Game.png';
import ChatIcon from '../../../public/assets/Icons/Chat.png';
import SettingsIcon from '../../../public/assets/Icons/Settings.png';
import AboutIcon from '../../../public/assets/Icons/About.png';
import LogoutIcon from '../../../public/assets/Icons/Logout.png';
import logoImage from '../../../public/assets/logo.png';
import './sideBar.css';


function Sidebar() {
  const sidebarItems = [
    { name: "Dashboard", icon: DashboardIcon, href: "/" },
    { name: "Game", icon: GameIcon, href: "/game" },
    { name: "Chat", icon: ChatIcon, href: "/chat" },
    { name: "Settings", icon: SettingsIcon, href: "/settings" },
    { name: "About", icon: AboutIcon, href: "/about" }
  ];

  const logoutItem = { name: "Logout", icon: LogoutIcon, href: "/logout" };

  return (
	<>
	  <div className="sidebar-container fixed z-10">
      <div className="sidebar items-center z-10">
	  <div className="sidebar__top z-10">
		  <img src={logoImage} alt="Logo" className="w-12 h-12 image" />
	  </div>
        <ul className="sidebar__list">
          {sidebarItems.map((item, index) => (
            <li className="sidebar__item" key={index}>
              <Link to={item.href}>
                <img src={item.icon} alt={item.name} className="sidebar__icon mt-2 mb-5" />
              </Link>
            </li>
          ))}
          <div className="sidebar__bottom">
            <Link to={logoutItem.href}>
              <img src={logoutItem.icon} alt={logoutItem.name} className="sidebar__icon"/>
            </Link>			
		      </div>
        </ul>
      </div>
    </div>
	</>
  );
}

export default Sidebar;