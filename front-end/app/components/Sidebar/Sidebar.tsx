import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

// import { AiOutlineHome, AiFillHome, AiOutlineWechat } from "react-icons/ai";
// import { BsChat, BsInfoCircle, BsGear, BsPeople} from "react-icons/bs";
// import { CiCircleMore } from "react-icons/ci";
// import { BiInfoCircle } from "react-icons/bi";
// import { TiContacts } from "react-icons/ti";
// import { FiMail } from "react-icons/fi";
// import { GiPingPongBat } from "react-icons/gi";


// Use the router only on the client side
const useClientRouter = () => {
  if (typeof window === "undefined") {
    // Running on the server - return a dummy object
    return { pathname: "" };
  }
  // Running on the client - import and use next/router
  const { useRouter } = require("next/router");
  return useRouter();
};

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "/Icons/Home.png",
  },
  {
    name: "Game",
    href: "/dashboard/game",
    icon: "/Icons/Game.png",
  },
  {
    name: "Chat",
    href: "/dashboard/chat",
    icon: "/Icons/Chat.png",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: "/Icons/Settings.png",
  },
  {
    name: "About",
    href: "/dashboard/about",
    icon: "/Icons/About.png",
  },
  ];

const logoutItem = {
  name: "Logout",
  href: "/logout",
  icon: "/Icons/Logout.png",
};

const Sidebar = () => {
  const router = useClientRouter();

  return (
    <div>
      <menu>
        <div className="sidebar__wrapper">
          <aside className="sidebar items-center">
            <div className="sidebar__top">
              <Image
                title="Logo"
                className="sidebar__logo"
                src="/logo.png"
                alt="logo"
                layout="responsive"
                width={200}
                height={200}
              />
            </div>
            <ul className="sidebar__list">
              {sidebarItems.map(({ name, href, icon }) => {
                return (
                  <li className="sidebar__item" key={name} title={name}>
                    <Link
                      className={`sidebar__link ${
                      router.pathname === href
                          ? "sidebar__link--active"
                          : ""
                    }`}
                      href={href}
                      >
                      <span className="sidebar__icon">
                        <Image
                          src={icon}
                          alt={`${name} icon`}
                          layout="responsive"
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
              <Link
                className={`sidebar__link ${
                router.pathname === logoutItem.href
                    ? "sidebar__link--active"
                    : ""
              }`}
                href={logoutItem.href}
                >
                <span className="sidebar__icon" title={logoutItem.name}>
                  <Image
                    src={logoutItem.icon}
                    alt={`${logoutItem.name} icon`}
                    layout="responsive"
                    width={500}
                    height={500}
                  />
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </menu>
    </div>
    );
};

export default Sidebar;
