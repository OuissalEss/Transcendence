'use client'
import React from "react";
import { Link } from "react-router-dom";
//import {deleteCookie} from "cookies-next";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: "/Icons/Home.png",
  },
  {
    name: "Game",
    href: "/game",
    icon: "/Icons/Game.png",
  },
  {
    name: "Chat",
    href: "/chat",
    icon: "/Icons/Chat.png",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "/Icons/Settings.png",
  },
  {
    name: "About",
    href: "/about",
    icon: "/Icons/About.png",
  },
  ];

const logoutItem = {
  name: "Logout",
  href: "/logout",
  icon: "/Icons/Logout.png",
};

const Sidebar = () => {
//  const router = useRouter();
  const pathname = "asd";

//  function LogOut() {
//   deleteCookie('token');
//   router.push('/');
//  }

  return (
    <div>
      <menu>
        <div className="sidebar__wrapper">
          <aside className="sidebar items-center">
            <div className="sidebar__top">
              <img
                title="Logo"
                className="sidebar__logo"
                src="/logo.png"
                alt="logo"
                style={{ width: "100%", height: "auto" }}
                width={200}
                height={200}
              />
            </div>
              <ul className="sidebar__list">
                  {sidebarItems.map(({ name, href, icon }, index) => {
                      return (
                          <li className="sidebar__item" key={index} title={name}>
                              <Link
                                  className={`sidebar__link ${
                                  pathname === href
                          ? "sidebar__link--active"
                          : ""
                              }`}
                                  to={href}
                                  >
                                  <span className="sidebar__icon">
                                      <img
                                          src={icon}
                                          alt={`${name} icon`}
                                          style={{ width: "100%", height: "auto" }}
                                          width={10}
                                          height={10}
                                      />
                                  </span>
                              </Link>
                          </li>
                          );
                  })}
              </ul>
              {/* Logout item outside the mapping loop */}
              <div className="sidebar__bottom">
                  <button className="sidebar__icon" title={logoutItem.name}>
                      <img
                          src={logoutItem.icon}
                          alt={`${logoutItem.name} icon`}
                          style={{ width: "100%", height: "auto" }}
                          width={500}
                          height={500}
                      />
                  </button>
              </div>
          </aside>
        </div>
      </menu>
    </div>
    );
};

export default Sidebar;
