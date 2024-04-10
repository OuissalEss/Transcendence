'use client'
import {Link, Navigate} from "react-router-dom";
import { redirect } from 'react-router-dom';

//import {deleteCookie} from "cookies-next";
import Cookies from "js-cookie";
import {useEffect} from "react";
import { useQuery, gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks'

const UPDATE_USER_STATUS = gql`
    mutation($new_status: String!) { 
      updateUserStatus(status: $new_status) {
        id
        username
      }
    }
`;

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
    name: "About us",
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
  const pathname = "asd";

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);

  async function LogOut() {
    try {
        await updateUserStatus({ variables: { new_status: "OFFLINE" } });
        console.log("Username updated successfully!");
      } catch (error) {
        console.error("Error updating Username:", error.message);
      }
    Cookies.remove('token');

    // Redirect to '/' after removing token
    window.location.reload();
  }

  return (
    <div>
      <menu>
        <div className="sidebar__wrapper">
          <aside className="sidebar items-center">
            <div className="sidebar__top">
              <Link to="/">
                <img title="Logo" className="sidebar__logo"
                  src="/logo.png" alt="logo" style={{ width: "100%", height: "auto" }} />
              </Link>
            </div>
            <ul className="sidebar__list">
              {sidebarItems.map(({ name, href, icon }, index) => {
                return (
                  <li className="sidebar__item" key={index} title={name}>
                    <Link
                      className={`sidebar__link ${pathname === href
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
              <button className="sidebar__icon" title={logoutItem.name} onClick={LogOut}>
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
