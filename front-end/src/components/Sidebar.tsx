'use client'
import { Link } from "react-router-dom";

//import {deleteCookie} from "cookies-next";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks'
import { Socket, io } from "socket.io-client";
import { useSocket } from '../App';

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

const CHANNEL = gql`
  query AllChannels {
    AllChannels {
      messages {
        senderId
        read
      }
    }
  }
`;

const user = JSON.parse(localStorage.getItem('user') || '{}');

const Sidebar = () => {
  const pathname = "asd";

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS);
  const [showNotification, setShowNotification] = useState(false);
  const [sock, setSocket] = useState<Socket>();
  const { socket } = useSocket();
  const { data, loading } = useQuery(CHANNEL);
  let unreadMessageCount = 0;
  useEffect(() => {
    if (data) {
      if (data) {
        data.AllChannels.forEach((channel: any) => {
          // Check if the channel has unread messages
          const filteredMessages = channel.messages.filter((message: any) => message.senderId !== user.id && !message.read);
          unreadMessageCount += filteredMessages.length;
        });
        if (unreadMessageCount)
          setShowNotification(true);
      }
    }

  }, [data, loading]);

  useEffect(() => {
    const newSocket = io('ws://localhost:3003/chat');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [setSocket]);

  useEffect(() => {
    sock?.on("messageUnread", (senderId: string) => {
      if (senderId === user.id)
        return;
      unreadMessageCount++;
      if (unreadMessageCount)
        setShowNotification(true);
    })
    sock?.on("messageRead", (senderId: string) => {
      if (senderId === user.id)
        return;
      unreadMessageCount--;
      if (unreadMessageCount <= 0)
        setShowNotification(false);
      unreadMessageCount = unreadMessageCount < 0 ? 0 : unreadMessageCount;
    })
    return () => {
      sock?.off("messageRead");
      sock?.off("messageUnread");
    }
  }, [sock])

  async function LogOut() {
    try {
      await updateUserStatus({ variables: { new_status: "OFFLINE" } });
      console.log("Username updated successfully!");
    } catch (error: any) {
      console.error("Error updating Username:", error?.message);
    }
    socket?.emit("friendDisconnected");
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
                  src="/logo.png" alt="logo" style={{ width: "100%", height: "auto" }} referrerPolicy="no-referrer" />
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
                      <span className="sidebar__icon relative">
                        <img
                          src={icon}
                          alt={`${name} icon`}
                          style={{ width: "100%", height: "auto" }}
                          width={10}
                          height={10}
                          referrerPolicy="no-referrer"
                        />
                        {name === 'Chat' && (
                          <div className={showNotification ? "cercleNotif visible" : "cercleNotif"}></div>
                        )}
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
                  referrerPolicy="no-referrer"
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
