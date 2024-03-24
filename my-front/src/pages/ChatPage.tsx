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
import { channel, channelItems, discussionItems } from '../interfaces/props';
import { useQuery } from '@apollo/client';
import { ALL_CHANNELS } from '../graphql/queries';

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
  const [display, setDisplay] = useState('');
  const [id, setId] = useState('');
  const {loading, error, data} = useQuery(ALL_CHANNELS);

  if (loading) console.log('channels : Loading...');
  else if (error) console.log('channel : Error:', error.message);
  else if (data) {
    console.log('All channels:', data);
    // extract the channels from the data
    const channels = data.AllChannels
    .map((channel: channel) => ({
            id: channel.id,
            title: channel.title,
            description: channel.description,
            type: channel.type,
            password: channel.password,
            icon: channel.profileImage,
            updatedAt: channel.updatedAt,
            owner: {
              id: channel.owner.id,
              name: channel.owner.username,
              icon: channel.owner.avatarTest
            },
            admins: channel.admins
            .map((admin: { id: string, username: string, avatarTest: string }) => ({
              id: admin.id,
              name: admin.username,
              icon: admin.avatarTest
            })),
            members: channel.members
            .map((member: { id: string, username: string, avatarTest: string, status: string }) => ({
              id: member.id,
              name: member.username,
              icon: member.avatarTest,
              status: member.status,
            })),
            banned: channel.banned.map((banned: { id: string, username: string, avatarTest: string }) => ({
              id: banned.id,
              name: banned.username,
              icon: banned.avatarTest
            })),
            muted: channel.muted.map((muted: { id: string, username: string, avatarTest: string }) => ({
              id: muted.id,
              name: muted.username,
              icon: muted.avatarTest
            })),
            messages: channel.messages
            .map((message: { id: string, text: string, time: Date, sender: string }) => ({
              text: message.text,
              sender: message.sender,
              time: message.time,
              read: true,
              unread: 0
            })).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
      })).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      console.log('channels:', channels)
    localStorage.setItem('channels', JSON.stringify(channels));
  }

  const channelsItems = [
    {id: "1", title: "channel1", icon: banner, type: "private"},
    {id: "2", title: "channel2", icon: banner, type: "protected"},
    {id: "3", title: "channel3", icon: banner, type: "public"},
    {id: "4", title: "channel4", icon: banner, type: "dm"},
    {id: "5", title: "channel5", icon: banner, type: "public", description: "public chat room !"},
  {id: "6", title: "channel6", icon: banner, type: "protected", description: "This is a protected channel with a long description exceeding 30 characters." },
  ];

  // to be updated : sort based on the last updated channel

  const discussions: discussionItems[] = [
    {id: "1", title: "channel1", icon: banner, type: "private", text: "Hey guys, I am new here !", read: false, time: new Date("2024-03-09T12:00:00"), unread: 3, sender: "Stella"},
    {id: "2", title: "channel2", icon: banner, type: "protected", text: "Hey guys, I am new here !", read: false, time: new Date("2024-03-09T09:00:00"), unread: 5, sender: "Slan"},
    {id: "3", title: "channel3", icon: banner, type: "public", text: "Hey guys, I am new here !", read: true, time: new Date("2024-03-09T08:00:00"), unread: 0, sender: "James"},
    {id: "4", title: "James", icon: friend3, type: "dm", text: "I am in the game, we can play later in the afternoon aaaaaaaaaaa", read: true, time: new Date("2024-03-09T08:00:00"), unread: 0, status: "INGAME"},
    {id: "5", title: "Stella", icon: friend1, type: "dm", text: "Hey, how are you ?", read: false, time: new Date("2024-03-09T12:00:00"), unread: 3, status: "ONLINE"},
    {id: "6", title: "Slan", icon: friend2, type: "dm", text: "Up for a game ?", read: true, time: new Date("2024-03-09T09:00:00"), unread: 0, status: "OFFLINE"},
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
return (
    <>
      <Layout/>
      <Discussions setDisplay={setDisplay} setId={setId}/>
      <div className="chat-container">
        {display === '' ? <NoChannelSelected/> : null}
        {display === 'JoinRoom' ? <JoinRoom channelsItems={channelsItems}/> : null}
        {display === 'NewRoom' ? <NewRoom setDisplay={setDisplay}/> : null}
        {display === 'Chat' ? <Chat id={id}/> : null}
      </div>
    </>
  );
}

export default ChatPageContainer;
