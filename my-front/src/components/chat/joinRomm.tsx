import { useEffect, useState } from "react";
import { IoLockClosed } from "react-icons/io5";
import { channelType, joinRoomProps, channel } from "../../interfaces/props";
import { ALL_CHANNELS } from "../../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEMBER } from "../../graphql/mutations";
import defaultPtofileImage from '../../../public/assets/chatBanner.png';

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
	const {loading, error, data} = useQuery(ALL_CHANNELS);
	const [passwordInputs, setPasswordInputs] = useState<{ [key: string]: boolean }>({});
	const [response, setResponse] = useState<{ [key: string]: boolean }>({});
	const [addMember] = useMutation(ADD_MEMBER);
	const [password, setPassword] = useState('');
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	let Channels: channelType[] = [];
	if (error) console.log('Channels : Error:', error.message);
	else if (loading) console.log('Channels : Loading...');
	else if (data) {
		// extract the channels from the data and filter out the channels that the user is not a member of
		Channels = data.AllChannels
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
			.map((message: { id: string, text: string, time: Date, sender: string, senderId: string }) => ({
			  text: message.text,
			  sender: message.sender,
			  senderId: message.senderId,
			  time: message.time,
			  read: true,
			  unread: 0
			})).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
	  })).sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
	}
	console.log('Channels:', Channels);

	const joinRoom = async (channelId: string) => {
		const memeber = await addMember({
			variables: {
				cid: channelId,
				uid: user.id,
			}
		});
		console.log('Member added:', memeber);
		setChannels((prevChannels: channelType[]) => {
			const newChannels = [...prevChannels];
			const newChannel = Channels.find((channel: channelType) => channel.id === channelId);
			// to update later
			console.log('New Channel:', newChannel);
			console.log('New Channels:', newChannels);
			newChannel?.members.push({
				id: user.id,
				name: user.username,
				icon: user.avatarTest,
				status: user.status,
			});
			if (newChannel) newChannels.push(newChannel);
			newChannels.sort((a: channelType, b: channelType) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
			return newChannels;
		});
		console.log('Channels:', channels);
	};

	const togglePasswordInput = (channelId: string) => {
		setPasswordInputs((prevInputs: { [key: string]: boolean }) => ({
			...prevInputs,
			[channelId]: !prevInputs[channelId],
		}));
	};

	const handleSubmitPassword = (e: React.FormEvent<HTMLInputElement>, channelId: string): void => {
		e.preventDefault();
		console.log('Password submitted for channel', channelId, ':', password);
		const channelPwd = Channels.find((channel: channelType) => channel.id === channelId)?.password;
		if (channelPwd === password) {
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
				{Channels.map((ch: channelType, index: number) => (
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