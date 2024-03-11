'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import jwt from 'jsonwebtoken';
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

// import { AiOutlineHome, AiFillHome, AiOutlineWechat } from "react-icons/ai";
// import { BsChat, BsInfoCircle, BsGear, BsPeople} from "react-icons/bs";
// import { CiCircleMore } from "react-icons/ci";
// import { BiInfoCircle } from "react-icons/bi";
// import { TiContacts } from "react-icons/ti";
// import { FiMail } from "react-icons/fi";
// import { GiPingPongBat } from "react-icons/gi";


const FriendsList = [
  {
    name: "Stella",
    icon: "/Avatars/02.jpeg",
    status: "ONLINE",
  },
  {
    name: "Slan",
    icon: "/Avatars/03.jpeg",
    status: "OFFLINE",
  },
  {
    name: "Wafae",
    icon: "/Avatars/05.png",
    status: "ONLINE",
  },
  {
    name: "James",
    icon: "/Avatars/12.jpeg",
    status: "AWAY",
  },
  {
    name: "Jinxx",
    icon: "/Avatars/07.jpeg",
    status: "INGAME",
  },
  {
    name: "Linda",
    icon: "/Avatars/09.png",
    status: "ONLINE",
  },
  {
    name: "Robert",
    icon: "/Avatars/13.jpeg",
    status: "OFFLINE",
  },
  {
    name: "John",
    icon: "/Avatars/15.png",
    status: "ONLINE",
  },
  {
    name: "Jessica89",
    icon: "/Avatars/08.jpeg",
    status: "INGAME",
  },
  {
    name: "David",
    icon: "/Avatars/18.png",
    status: "AWAY",
  },
  ];

const Friends = () => {

  return (
    <div>
      <menu>
        <div className="friends friends_wrapper">
            <div className="friends_top">
              <Link className='' href='/dashboard/profile' >
                <span className="my-pic" title='My Profile'>
                  <Image
                    className="friend-img" src="/Avatars/01.jpeg"
                    layout="responsive" width={200} height={200}
                  />
                </span>
              </Link>
            </div>
            <ul className="friends_list">
              {FriendsList.map(({ name, icon }) => {
                return (
                  <li className="friends_item" key={name} title={name}>
                      <div className="friend-icon">
                        <span >
                          <Image
                            className="friend-img" src={icon}
                            layout="responsive" width={10} height={10}
                          />
                        </span>
                      </div>
                      <div className="friend-name">
                        <span>{name}</span>
                      </div>
                  </li>
                  );
              })}
            </ul>
        </div>
      </menu>
    </div>
    );
};

export default Friends;
