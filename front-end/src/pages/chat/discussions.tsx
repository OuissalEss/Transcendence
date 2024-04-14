import { useEffect, useState } from 'react';
import { channel, channelType, DiscussionsProps } from './interfaces/props';
import './chat.css';
import { Socket, io } from 'socket.io-client';
import client from '../../apolloClient';
import { CHANNEL_BY_ID } from '../../graphql/queries';


const Discussions: React.FC<DiscussionsProps> = ({
    setDisplay,
	setId,
	channels,
	setChannels,
}) => {
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	const [room, setRoom] = useState('');
	const [socket, setSocket] = useState<Socket>();
	const [isTyping, setIsTyping] = useState(false);

	const unreadMessages = (
		messages: {
			text: string;
			sender: string;
			senderId: string;
			time: Date;
			read: boolean;
		}[]
	) => {
		let unread = 0;
		messages.forEach((message) => {
			// console.log(message.sender, user.username, message.read, "unreadMessages", user.username);
			if (message.sender !== user.username && !message.read) {
				unread++;
			}
		});
		return unread;
	};
	useEffect(() => {
        const newSocket = io('ws://localhost:3003/chat');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [setSocket]);

	useEffect(() => {
		socket?.on('typingDiscussion', async (User: string, room: string) => {
			if (User !== user.id) {
				setIsTyping(true);
				setRoom(room);
			}
		});
	
		socket?.on('stopTypingDiscussion', () => {
			setIsTyping(false);
		});

		socket?.on('msg', async (data:  { id: string, sender: string, text: string, time: Date, senderId: string, read: boolean}, room: string) => {
			const channel = channels.find((ch: any) => ch.id === room);
			if (!channel) {
				const { data } = await client.query({
					query: CHANNEL_BY_ID,
					variables: { id: room },
				});
				const newChannel: channelType = {
					id: data.ChannelById.id,
					title: data.ChannelById.title,
					description: data.ChannelById.description,
					type: data.ChannelById.type,
					password: data.ChannelById.password,
					icon: data.ChannelById.profileImage,
					updatedAt: data.ChannelById.updatedAt,
					owner: {
					  id: data.ChannelById.owner.id,
					  name: data.ChannelById.owner.username,
					  icon: data.ChannelById.owner.avatar?.filename
					},
					admins: data.ChannelById.admins
					.map((admin: { id: string, username: string, avatar:{filename: string} }) => ({
					  id: admin.id,
					  name: admin.username,
					  icon: admin.avatar?.filename
					})),
					members: data.ChannelById.members
					.map((member: { id: string, username: string, avatar:{filename: string}, status: string, blocked: {blockedUserId: string;}[], blocking: {blockerId: string;}[]}) => ({
					  id: member.id,
					  name: member.username,
					  icon: member.avatar?.filename,
					  status: member.status,
					  blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
					  blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
					})),
					banned: data.ChannelById.banned.map((banned: { id: string, username: string, avatar:{filename: string} }) => ({
					  id: banned.id,
					  name: banned.username,
					  icon: banned.avatar?.filename
					})),
					muted: data.ChannelById.muted.map((muted: { id: string, username: string, avatar:{filename: string} }) => ({
					  id: muted.id,
					  name: muted.username,
					  icon: muted.avatar?.filename
					})),
					messages: data.ChannelById.messages
					.map((message: { id: string, text: string, time: Date, sender: string, senderId: string, read: boolean }) => ({
					  id: message.id,
					  text: message.text,
					  sender: message.sender,
					  senderId: message.senderId,
					  time: message.time,
					  read: message.read,
					})).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
			  }
			  // add the new channel to the previous channels using setChannels
			  setChannels((prevChannels: any) => {
				const found = prevChannels.find((channel: { id: string; }) => channel.id === newChannel.id);
				if (!found) {
				  return [...prevChannels, newChannel];
				}
				return prevChannels;
			  });
			}
			setChannels((prevChannels: any) => {
			const updatedChannels = prevChannels.map((channel: channelType) => {
				if (channel.id === room) {
					const message = {
						id: data.id,
						text: data.text,
						sender: data.sender,
						senderId: data.senderId,
						time: data.time,
						read: data.read,
					};
					const found = channel.messages.find((msg) => msg.id === message.id);
					if (!found) {
						channel.messages = [...channel.messages, message];
						channel.messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
					}

				}
				return channel;
			});
			updatedChannels.sort((a: any, b: any) => {
				const msg1 = a.messages.length > 0 ? a.messages[a.messages.length - 1].time : new Date(0); // replace 0 with the last updated time
				const msg2 = b.messages.length > 0 ? b.messages[b.messages.length - 1].time : new Date(0);
				return new Date(msg2).getTime() - new Date(msg1).getTime();
			  })
			return updatedChannels;
		});

		});

		socket?.on('remove', (room: string, User: string) => {
			if (User === user.id)
				setChannels((prevChannels: any) => prevChannels.filter((channel: { id: string; }) => channel.id !== room));
		});

		socket?.on('addRoom', async (id: string) => {
			const { data } = await client.query({
				query: CHANNEL_BY_ID,
				variables: { id },
			});
			console.log(data, "addRoom", id);

			const newChannel: channelType = {
				id: data.ChannelById.id,
				title: data.ChannelById.title,
				description: data.ChannelById.description,
				type: data.ChannelById.type,
				password: data.ChannelById.password,
				icon: data.ChannelById.profileImage,
				updatedAt: data.ChannelById.updatedAt,
				owner: {
				  id: data.ChannelById.owner.id,
				  name: data.ChannelById.owner.username,
				  icon: data.ChannelById.owner.avatar?.filename
				},
				admins: data.ChannelById.admins
				.map((admin: { id: string, username: string, avatar:{filename: string} }) => ({
				  id: admin.id,
				  name: admin.username,
				  icon: admin.avatar?.filename
				})),
				members: data.ChannelById.members
				.map((member: { id: string, username: string, avatar:{filename: string}, status: string, blocked: {blockedUserId: string;}[], blocking: {blockerId: string;}[]}) => ({
				  id: member.id,
				  name: member.username,
				  icon: member.avatar?.filename,
				  status: member.status,
				  blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
				  blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
				})),
				banned: data.ChannelById.banned.map((banned: { id: string, username: string, avatar:{filename: string} }) => ({
				  id: banned.id,
				  name: banned.username,
				  icon: banned.avatar?.filename
				})),
				muted: data.ChannelById.muted.map((muted: { id: string, username: string, avatar:{filename: string} }) => ({
				  id: muted.id,
				  name: muted.username,
				  icon: muted.avatar?.filename
				})),
				messages: data.ChannelById.messages
				.map((message: { id: string, text: string, time: Date, sender: string, senderId: string, read: boolean }) => ({
				  id: message.id,
				  text: message.text,
				  sender: message.sender,
				  senderId: message.senderId,
				  time: message.time,
				  read: message.read,
				})).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
		  }
		  // add the new channel to the previous channels using setChannels
		  setChannels((prevChannels: any) => {
			const found = prevChannels.find((channel: { id: string; }) => channel.id === newChannel.id);
			if (!found) {
			  return [...prevChannels, newChannel];
			}
			return prevChannels;
		  });
		});
		  
		return () => {
			socket?.off('typingDiscussion');
			socket?.off('stopTypingDiscussion');
			socket?.off('msg');
			socket?.off('remove');
			socket?.off('addRoom');
		};
	}, [socket]);

    return (
        <div className="discussion-container z-10">
            <div className="fixed z-10 top-7 left-8">
                <p className="text-1">Discussions</p>
            </div>
            <div className='button-container'>
                <button className="transparent-button ml-7 mt-6" onClick={() => setDisplay('JoinRoom')}>Join room</button>
                <button className="transparent-button mr-7 mt-6" onClick={() => setDisplay('NewRoom')}>New room</button>
            </div>
            <div className="chat-list">
			{channels.map((discussion: channelType, index: number) => (
				<div key={discussion.id} className="chat-box" onClick={() => {
					setId(channels[index].id);
					setDisplay("Chat");
				}}>
					<div className="img-box">
					{discussion.type === 'DM' ? (
						discussion.members.map((member) => (
							member.name !== user.username && (
								<img key={member.id} className="w-full h-full object-cover" src={member.icon} alt={member.name} />
							)
						))
					) : (
						<img className="w-full h-full object-cover" src={discussion.icon} alt={discussion.title} />
					)}
					</div>
					<div className="chat-details">
						<div className="text-head">
							{discussion.type === 'DM' ? (
								discussion.members.map((member) => (
									member.name !== user.username && (
										<h4 key={member.id} className="name">{member.name}</h4>
									)
								))
							) : (
								<h4 className="name">{discussion.title}</h4>
							)}
							<p className="time unread">{discussion.messages.length === 0 ? new Date(discussion.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : new Date(discussion.messages[discussion.messages?.length - 1]?.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
						</div>
						<div className="text-message">
							<p className={(!discussion.messages.length || (discussion.messages[discussion.messages.length - 1].read === false && discussion.messages[discussion.messages.length - 1].senderId !== user.id) ) ? "unread" : ""}>
								{ isTyping && discussion.id === room ? (
									"Typing..."
								) : discussion.messages.length > 0 ? (
									`${discussion.messages[discussion.messages.length - 1].sender}: ${discussion.messages[discussion.messages.length - 1].text.length > 30 ? discussion.messages[discussion.messages.length - 1].text.slice(0, 30) + "..." : discussion.messages[discussion.messages.length - 1].text}`
								) : (
									discussion.type === 'DM' ? "Say hi to your friend" : "Say hi to your friends"
								)}
							</p>
							{discussion.messages.length > 0 && unreadMessages(discussion.messages) > 0 && (
								<b>{unreadMessages(discussion.messages)}</b>
							)}
						</div>
					</div>
				</div>
			))}

            </div>
        </div>
    );
}

export default Discussions;