import Chat from './chat';
import Discussions from './discussions';
import './chat.css';
import { HiUserGroup } from "react-icons/hi";
import { useEffect, useState } from 'react';
import NewRoom from './newRoom';
import JoinRoom from './joinRoom';
import { channel, channelType } from './interfaces/props';
import { useQuery } from '@apollo/client';
import { ALL_CHANNELS } from '../../graphql/queries';
import React from 'react';

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
  const [channels, setChannels] = useState<channelType[]>([]);
  const { loading, error, data } = useQuery(ALL_CHANNELS);
  const user = JSON.parse(localStorage.getItem('user') || '{}');


  useEffect(() => {
    if (error) console.log('channels : Error:', error.message);
    else if (data) {
      console.log('All channels:', data);
      // extract the channels from the data
      const temp = data.AllChannels
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
            icon: channel.owner.avatar?.filename
          },
          admins: channel.admins
            .map((admin: { id: string, username: string, avatar: { filename: string } }) => ({
              id: admin.id,
              name: admin.username,
              icon: admin.avatar?.filename
            })),
          members: channel.members
            .map((member: { id: string, username: string, avatar: { filename: string }, status: string, blocked: { blockedUserId: string; }[], blocking: { blockerId: string; }[] }) => ({
              id: member.id,
              name: member.username,
              icon: member.avatar?.filename,
              status: member.status,
              // xp: member.xp,
              blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
              blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
            })),
          banned: channel.banned.map((banned: { id: string, username: string, avatar: { filename: string } }) => ({
            id: banned.id,
            name: banned.username,
            icon: banned.avatar?.filename
          })),
          muted: channel.muted.map((muted: { id: string, username: string, avatar: { filename: string } }) => ({
            id: muted.id,
            name: muted.username,
            icon: muted.avatar?.filename
          })),
          messages: channel.messages
            .map((message: { id: string, text: string, time: Date, sender: string, senderId: string, read: boolean }) => ({
              id: message.id,
              text: message.text,
              sender: message.sender,
              senderId: message.senderId,
              time: message.time,
              read: message.read,
            })).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
        }))
      temp.sort((a: any, b: any) => {
        const msg1 = a.messages.length > 0 ? a.messages[a.messages.length - 1].time : new Date(0);
        const msg2 = b.messages.length > 0 ? b.messages[b.messages.length - 1].time : new Date(0);
        return new Date(msg2).getTime() - new Date(msg1).getTime();
      })
      console.log("USER: ", user);
      // setChannels(temp);
      setChannels(temp.filter((channel: channelType) => channel.members.some((member) => member.name === user.username)));
      console.log('channels:', channels)
    }
  }, [loading, error, data]);

  return (
    <>
      <Discussions setDisplay={setDisplay} setId={setId} channels={channels} setChannels={setChannels} />
      <div className="chat-container">
        {display === '' && <NoChannelSelected />}
        {display === 'JoinRoom' && <JoinRoom channels={channels} setChannels={setChannels} setDisplay={setDisplay} setId={setId} />}
        {display === 'NewRoom' && <NewRoom setDisplay={setDisplay} setChannels={setChannels} />}
        {display === 'Chat' && <Chat id={id} channels={channels} setChannels={setChannels} setDisplay={setDisplay} setId={setId} />}
      </div>
    </>
  );
}

export default ChatPageContainer;
