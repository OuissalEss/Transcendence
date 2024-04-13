import { useEffect, useState } from "react";
import { IoLockClosed } from "react-icons/io5";
import { channelType, joinRoomProps, channel } from "./interfaces/props";
import { ALL_CHANNELS } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEMBER } from "../../graphql/mutations";
import defaultPtofileImage from '/Chat/chatBanner.png';
import { Socket, io } from "socket.io-client";
import bcrypt from 'bcryptjs';


/**
 * TODO:
 * - Add the ability to join a room :
 *   - If the room is public, the user should be able to join the room directly addmember mutation is called on the current user
 * 		give setindex the newly added room index and set display to chat
 *  - If the room is protected, the user should be able to join the room by entering the password same steps above should be followed
 *  - Only display the rooms that the user is not a member of
 */

const JoinRoom: React.FC<joinRoomProps> = ({
	channels,
	setChannels,
	setDisplay,
	setId,
}) => {
	const [passwordInputs, setPasswordInputs] = useState<{ [key: string]: boolean }>({});
	const [response, setResponse] = useState<{ [key: string]: boolean }>({});
	const [addMember] = useMutation(ADD_MEMBER);
	const [password, setPassword] = useState('');
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	const { loading, error, data } = useQuery(ALL_CHANNELS);
	const [Channels, updateChannels] = useState<channelType[]>([]);
	const [socket, setSocket] = useState<Socket>();
	// const [socket, setSocket] = useState<Socket>();
	// let Channels: channelType[] = [];
	const fetch_channels = async () => {

		if (error) console.log('Channels : Error:', error.message);
		else if (loading) console.log('Channels : Loading...');
		else if (data) {
			// extract the channels from the data and filter out the channels that the user is not a member of
			const All_Channels = data.AllChannels
				.filter((channel: channelType) =>
					!channel.members.some((member: { id: string }) => member.id === user.id) &&
					channel.type !== "DM" &&
					channel.type !== "PRIVATE"
				)
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
						icon: channel.owner.avatar.filename
					},
					admins: channel.admins
						.map((admin: { id: string, username: string, avatar: { filename: string } }) => ({
							id: admin.id,
							name: admin.username,
							icon: admin.avatar.filename
						})),
					members: channel.members
						.map((member: { id: string, username: string, avatar: { filename: string }, status: string, blocked: { blockedUserId: string; }[], blocking: { blockerId: string; }[] }) => ({
							id: member.id,
							name: member.username,
							icon: member.avatar.filename,
							status: member.status,
							blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
							blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
						})),
					banned: channel.banned.map((banned: { id: string, username: string, avatar: { filename: string } }) => ({
						id: banned.id,
						name: banned.username,
						icon: banned.avatar.filename
					})),
					muted: channel.muted.map((muted: { id: string, username: string, avatar: { filename: string } }) => ({
						id: muted.id,
						name: muted.username,
						icon: muted.avatar.filename
					})),
					messages: channel.messages
						.map((message: { id: string, text: string, time: Date, sender: string, senderId: string }) => ({
							text: message.text,
							sender: message.sender,
							senderId: message.senderId,
							time: message.time,
							read: true,
							unread: 0
						})).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
				})).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
			updateChannels(All_Channels);
		}
		console.log('Channels:', Channels);
	};

	useEffect(() => {
		fetch_channels();
	}, [loading, error, data]);

	useEffect(() => {
		const newSocket = io('ws://localhost:3003/chat');
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [setSocket]);

	const joinRoom = async (channelId: string) => {
		// emit a join event to the server
		// emit an add member event instead of using the mutation
		socket?.emit('add', { room: channelId, user: user.id })
		updateChannels([]);
		setChannels((prevChannels: channelType[]) => {
			const newChannels = [...prevChannels];
			const newChannel = Channels.find((channel: channelType) => channel.id === channelId);
			newChannel?.members.push({
				id: user.id,
				name: user.username,
				icon: user.avatar.filename,
				status: user.status,
				blocked: [], // to handle later
				blocken: [],
			});
			if (newChannel) newChannels.push(newChannel);
			newChannels.sort((a: channelType, b: channelType) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
			return newChannels;
		});
	};

	const togglePasswordInput = (channelId: string) => {
		setPasswordInputs((prevInputs: { [key: string]: boolean }) => ({
			...prevInputs,
			[channelId]: !prevInputs[channelId],
		}));
	};

	const handleSubmitPassword = async (e: React.FormEvent<HTMLInputElement>, channelId: string) => {
		e.preventDefault();
		console.log('Password submitted for channel', channelId, ':', password);
		const channelPwd = Channels.find((channel: channelType) => channel.id === channelId)?.password;
		const isMatch = await bcrypt.compare(password || '', channelPwd || '');
		if (isMatch) {
			console.log('Password correct');
			joinRoom(channelId);
			setPasswordInputs((prevInputs: { [key: string]: boolean }) => ({
				...prevInputs,
				[channelId]: false,
			}));
			setResponse((prevResponse: { [key: string]: boolean }) => ({
				...prevResponse,
				[channelId]: false,
			}));
			setPassword('');
			setDisplay('Chat');
		} else {
			console.log('Password incorrect');
			setResponse((prevResponse: { [key: string]: boolean }) => ({
				...prevResponse,
				[channelId]: !prevResponse[channelId],
			}));
		}
		setPassword('');
	};

	return (
		<div className="channels-container">
			<div className="channel-list">
				{Channels
					.filter((ch: channelType) => {
						return !ch.banned.some((member: { id: string }) => member.id === user.id) && !ch.members.some((member: { id: string }) => member.id === user.id);
					})
					.map((ch: channelType, index: number) => (
						(ch.type !== 'dm' && ch.type !== 'private') && (
							<div key={index} className="channel-box">
								{!ch.icon ? (
									<div className="channel-profile" style={{ backgroundImage: `url(${defaultPtofileImage})` }}>
										{ch.type === 'protected' && <IoLockClosed />}
									</div>
								)
									: (
										<div className="channel-profile" style={{ backgroundImage: `url(${ch.icon})` }}>
											{ch.type === 'protected' && <IoLockClosed />}
										</div>
									)}

								<div className="title-box">{ch.title}</div>
								<div className="description-box">
									{ch.description ? (
										ch.description.length > 30 ? (
											`${ch.description.slice(0, 30)}...`
										) : (
											ch.description
										)
									) : (
										'Join the community !'
									)}
								</div>
								<div className="request-btn-row">
									{ch.type === 'PROTECTED' ? (
										<>
											{passwordInputs[ch.id] ? (
												<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmitPassword(e as unknown as React.FormEvent<HTMLInputElement>, ch.id)}>
													{response[ch.id] && (
														<p className="channel-request accept-request">Incorrect Password</p>
													)}
													<input
														type="password"
														placeholder="Password"
														className="channel-request accept-request"
														value={password}
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
														onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
															if (e.key === 'Enter') {
																// setPassword(e.currentTarget.value);
																handleSubmitPassword(e as unknown as React.FormEvent<HTMLInputElement>, ch.id);
															}
														}}
													/>
													<button type="submit" className="channel-request accept-request">submit</button>
												</form>
											) : (
												<button
													className="channel-request accept-request"
													onClick={() => togglePasswordInput(ch.id)}
												>
													Join Room
												</button>
											)}
										</>
									) : ch.type === 'PUBLIC' ? (
										<button
											className="channel-request accept-request"
											onClick={() => {
												joinRoom(ch.id);
												setId(ch.id);
												setDisplay('Chat');
											}}
										>
											Join Room
										</button>
									) : null}
								</div>
							</div>
						)
					))}
			</div>
		</div>
	);
};

export default JoinRoom;