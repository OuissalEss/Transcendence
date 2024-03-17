import Chat from '../components/chat/chat';
import Discussions from '../components/chat/discussions';
import '../components/chat/chat.css';
import { HiUserGroup } from "react-icons/hi";
import friend1 from '../../public/assets/Avatars/02.jpeg';
import friend2 from '../../public/assets/Avatars/03.jpeg';
import friend3 from '../../public/assets/Avatars/14.png';
import friend4 from '../../public/assets/Avatars/18.png';
import me from '../../public/assets/Avatars/06.png';
import friend6 from '../../public/assets/Avatars/07.jpeg';
import friend7 from '../../public/assets/Avatars/08.jpeg';
import friend8 from '../../public/assets/Avatars/09.png';
import friend9 from '../../public/assets/Avatars/10.jpeg';
import friend10 from '../../public/assets/Avatars/11.png';

import banner from '../../public/assets/chatBanner.png'
import { useState } from 'react';
import NewRoom from '../components/chat/newRoom';
import JoinRoom from '../components/chat/joinRomm';
import Layout from '../components/chat/layout';

interface discussionItems {
	title: string;
	icon: string;
	type: string;
	text: string;
	read: boolean;
	time: Date;
	unread: number;
	status?: string;
	sender?: string;
}

interface messageItems {
	text: string;
	sender: string;
	time: Date;
	read: boolean;
}

interface channelItems {
	messages: messageItems[];
	admins?: {
	  name: string;
	  icon: string;
	}[];
	owner?: {
	  name: string;
	  icon: string;
  };
	password?: string;
	description?: string;
	type: string;
	icon: string;
	title: string;
	members?: {
	  name: string;
	  icon: string;
	}[];
	banned?: {
	  name: string;
	  icon: string;
	}[];
	muted?: {
	  name: string;
	  icon: string;
	  duration?: number; // 7h - 168h (week) - always (permanent = true)
	  isMuted?: boolean;
	  isPermanent?: boolean;
	}[];
	status?: string;
}

function NoChannelSelected() {
  return (
    <div className="flex center ">
      <HiUserGroup className="w-40 h-40 text-white center pos-icon-container" />
      <div className="fixed z-10 center pos-icon">
        <p className="text-2">No Discussion Selected !</p>
      </div>
    </div>
  );
}

function ChatPageContainer() {
  const [lock, setLock] = useState(true);
  const [showPasswordContainer, setShowPasswordContainer] = useState(false);
  const [display, setDisplay] = useState('');
  const [index, setIndex] = useState(0);
  

  const toggleLock = () => {
    setLock((prevState: any) => !prevState);
    setShowPasswordContainer(true);
    console.log(lock + ' ha lock');
  };

  const friendsItems = [
    { name: "Stella", icon: friend1},
    { name: "Slan", icon: friend2},
    { name: "James", icon: friend3},
    { name: "Jinxx", icon: friend4 },
    // { name: "Stella", icon: friend1},
    // { name: "Slan", icon: friend2},
    // { name: "James", icon: friend3},
    // { name: "Jinxx", icon: friend4 },
    // { name: "Jinxx", icon: friend4 },
    // { name: "Slan", icon: friend2},
    // { name: "James", icon: friend3},
    // { name: "Jinxx", icon: friend4 },
    // { name: "Jinxx", icon: friend4 },
  ];

  const channelsItems = [
    { title: "channel1", icon: banner, type: "private"},
    { title: "channel2", icon: banner, type: "protected"},
    { title: "channel3", icon: banner, type: "public"},
    { title: "channel4", icon: banner, type: "dm"},
    { title: "channel5", icon: banner, type: "public", description: "public chat room !"},
  { title: "channel6", icon: banner, type: "protected", description: "This is a protected channel with a long description exceeding 30 characters." },
  ];

  // to be updated : sort based on the last updated channel

  const discussions: discussionItems[] = [
    {title: "channel1", icon: banner, type: "private", text: "Hey guys, I am new here !", read: false, time: new Date("2024-03-09T12:00:00"), unread: 3, sender: "Stella"},
    {title: "channel2", icon: banner, type: "protected", text: "Hey guys, I am new here !", read: false, time: new Date("2024-03-09T09:00:00"), unread: 5, sender: "Slan"},
    {title: "channel3", icon: banner, type: "public", text: "Hey guys, I am new here !", read: true, time: new Date("2024-03-09T08:00:00"), unread: 0, sender: "James"},
    {title: "James", icon: friend3, type: "dm", text: "I am in the game, we can play later in the afternoon aaaaaaaaaaa", read: true, time: new Date("2024-03-09T08:00:00"), unread: 0, status: "INGAME"},
    {title: "Stella", icon: friend1, type: "dm", text: "Hey, how are you ?", read: false, time: new Date("2024-03-09T12:00:00"), unread: 3, status: "ONLINE"},
    {title: "Slan", icon: friend2, type: "dm", text: "Up for a game ?", read: true, time: new Date("2024-03-09T09:00:00"), unread: 0, status: "OFFLINE"},
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

const Channels: channelItems[] = [
  {
    messages: [
      { text: "Hey guys, I am new here !", sender: "Stella", time: new Date("2024-03-09T12:00:00"), read: false },
      { text: "Hey guys, I am new here !", sender: "Slan", time: new Date("2024-03-09T09:00:00"), read: false },
      { text: "Hey guys, I am new here !", sender: "Jinxx", time: new Date("2024-03-09T08:00:00"), read: false },
      { text: "Hey guys, I am new here !", sender: "James", time: new Date("2024-03-07T08:00:00"), read: true },
    ],
    admins: [
      { name: "Stella", icon: friend1 },
      { name: "Slan", icon: friend2 },
    ],
    owner: { name: "me", icon: me },
    type: "private",
    icon: banner,
    title: "channel1",
    members: [
      { name: "Stella", icon: friend1 },
      { name: "Slan", icon: friend2 },
      { name: "James", icon: friend3 },
      { name: "Jinxx", icon: friend4 },
      { name: "Joe", icon: friend6 },
      { name: "me", icon: me },
    ],
    banned: [
      { name: "Jen", icon: friend10 },
    ],
    muted: [
      { name: "James", icon: friend3, duration: 168, isMuted: true, isPermanent: false},
    ],
  },
  {
    messages: [
      { text: "Hey guys, I am new here !", sender: "Slan", time: new Date("2024-03-09T09:00:00"), read: false },
      { text: "Hey guys, I am new here !", sender: "Jinxx", time: new Date("2024-03-09T08:00:00"), read: false },
      { text: "Welcome to the club !", sender: "James", time: new Date("2024-03-09T08:00:00"), read: false },
      { text: "add me as an administator", sender: "Stella", time: new Date("2024-03-07T08:00:00"), read: false },
      { text: "Hello everyone !", sender: "Joe", time: new Date("2024-03-09T08:00:00"), read: false },
      { text: "Hello Jen !", sender: "me", time: new Date("2024-03-09T08:00:00"), read: true},
      { text: "Hello everyone !", sender: "Jen", time: new Date("2024-03-09T08:00:00"), read: true },
    ],
    admins: [
      { name: "Stella", icon: friend1 },
      { name: "Joe", icon: friend6 },
      { name: "me", icon: me },
    ],
    owner: { name: "Slan", icon: friend2 },
    password: "1234",
    type: "protected",
    icon: banner,
    title: "channel2",
    members: [
      { name: "Stella", icon: friend1 },
      { name: "Slan", icon: friend2 },
      { name: "James", icon: friend3 },
      { name: "Jinxx", icon: friend4 },
      { name: "Joe", icon: friend6 },
      { name: "me", icon: me },
    ],
  },
  {
    messages: [
      { text: "Hey guys, I am new here !", sender: "James", time: new Date("2024-03-09T08:00:00"), read: true },
      { text: "Hey guys, I am new here !", sender: "Jinxx", time: new Date("2024-03-09T08:00:00"), read: true },
      { text: "Hey guys, I am new here !", sender: "Joe", time: new Date("2024-03-09T08:00:00"), read: true },
      { text: "Hey guys, I am new here !", sender: "Jen", time: new Date("2024-03-09T08:00:00"), read: true },
    ],
    owner: { name: "James", icon: friend1 },
    type: "public",
    icon: banner,
    title: "channel3",
    members: [
      { name: "Stella", icon: friend1 },
      { name: "Slan", icon: friend2 },
      { name: "James", icon: friend3 },
      { name: "Jinxx", icon: friend4 },
      { name: "Joe", icon: friend6 },
      { name: "Jack", icon: friend7 },
      { name: "Jill", icon: friend8 },
    ],
    banned: [
      { name: "Mike", icon: friend7 },
    ],
    muted: [
      { name: "me", icon: me, isPermanent: true },
    ],
  },
  {
    messages: [
      { text: "I am in the game, we can play later in the afternoon aaaaaaaaaaa", sender: "James", time: new Date("2024-03-09T08:00:00"), read: true },
    ],
    type: "dm",
    icon: friend3,
    title: "James",
    muted: [
      { name: "me", icon: me, duration: 168, isMuted: true, isPermanent: false},
    ],
    status: "INGAME",
  },
  {
    messages: [
      { text: "Hey, how are you ?", sender: "Stella", time: new Date("2024-03-09T12:00:00"), read: false },
      {text: "Just won my first game !!", sender: "Stella", time: new Date("2024-03-09T11:00:00"), read: false },
      { text: "Check out my new avatar !", sender: "Stella", time: new Date("2024-03-09T10:00:00"), read: false},
      { text: "Up for a game ?", sender: "me", time: new Date("2024-03-09T09:00:00"), read: true },
      { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, \
                sed do eiusmod tempor incididunt ut labore et dolore magna \
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation \
                ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis \
                aute irure dolor in reprehenderit in voluptate velit esse cillum \
                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat \
                non proident, sunt in culpa qui officia deserunt mollit anim id est \
                laborum.", sender: "Stella", time: new Date("2024-03-09T08:00:00"), read: true },
    ],
    type: "dm",
    icon: friend1,
    title: "Stella",
    status: "ONLINE", 
  },
  {
    messages: [
      { text: "Up for a game ?", sender: "Slan", time: new Date("2024-03-09T09:00:00"), read: true },
    ],
    type: "dm",
    icon: friend2,
    title: "Slan",
    status: "OFFLINE",
  },
];

  const [discussion, setDiscussion] = useState(discussions);
  const [channels, setChannels] = useState(Channels);
  return (
    <>
      <Layout/>
      <Discussions setDisplay={setDisplay} setIndex={setIndex} setDiscussion={setDiscussion} discussionItems={discussion}/>
      <div className="chat-container">
        {/* <NoChannelSelected/>
        <NewRoom friendsItems={friendsItems} lock={lock} toggleLock={toggleLock} setShowPasswordContainer={setShowPasswordContainer} showPasswordContainer={showPasswordContainer} />
        <JoinRoom channelsItems={channelsItems} /> */}
        {display === '' ? <NoChannelSelected/> : null}
        {display === 'JoinRoom' ? <JoinRoom channelsItems={channelsItems}/> : null}
        {display === 'NewRoom' ? <NewRoom friendsItems={friendsItems} lock={lock} toggleLock={toggleLock} setShowPasswordContainer={setShowPasswordContainer} showPasswordContainer={showPasswordContainer}/> : null}
        {display === 'Chat' ? <Chat channel={channels[channels.findIndex(item => item.title === discussions[index].title)]} setChannels={setChannels} channels={channels} index={index}/> : null}
      </div>
    </>
  );
}

export default ChatPageContainer;
