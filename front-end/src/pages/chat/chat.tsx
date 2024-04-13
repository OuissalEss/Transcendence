import { IoSend } from "react-icons/io5";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { GiPingPongBat } from "react-icons/gi";
import { IoSettingsSharp, IoExit } from "react-icons/io5";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoBanSharp } from "react-icons/io5";
import { MdOutlineCancel, MdOutlineCheckCircle} from "react-icons/md";
import { CiCamera, CiLock, CiUnlock } from "react-icons/ci";
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight, FaPen } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdBlock } from "react-icons/md";
import { chatProps, PasswordSettingsProps, ChannelSettingsProps, channel } from "./interfaces/props";
import {channelType} from "./interfaces/props";
import io, { Socket } from 'socket.io-client';
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_CHANNEL_DESCRIPTION, UPDATE_CHANNEL_PASSWORD, UPDATE_CHANNEL_PROFILE_IMAGE, UPDATE_CHANNEL_TITLE, UPDATE_CHANNEL_TYPE, UPDATE_CHANNEL_TYPE_USER } from "../../graphql/mutations";
import client from "../../apolloClient";
import { CHANNEL_BY_ID, IS_BLOCKED } from "../../graphql/queries";
import bcrypt from 'bcryptjs';

// admins cant be muted but can mute ban and kick others except the owner
// owner can do anything but can't be muted banned or kicked
// members cant mute ban or kick others they only can leave the channel
// only the owner can change the channels privacy

/**
 * TODO:
 * admins should not have the option to kick mute or ban shown in the dropdown menu for the owner
 * user should be able to block or invite a user to a game in a channel or in dms 
 * 7eydi dm/block/invite to a game mn menu d settings w diri another meno that pops up when you left click on a user message fchi group chat
 * unable members to access the second page of the setting page where they can see the muted, banned and mod list without being 
 * able to change anything they shouldnt have the setting option displayed either in the first page
 * if a channel owner left the channel the oldest admin should be promoted to owner
 * if a user is blocked or blocken by someone they shouldnt be able to see each others messages in a room
 * in a dm if a user is blocked or blocken by someone they can't send messages to each other
 * check the owner of the channels queried ( dm channels have no owner )
 */


const user = JSON.parse(localStorage.getItem('user') || '{}');


function getStatusColor(status: string) {
	switch (status) {
	  case "ONLINE":
		return "bg-green-500";
	  case "OFFLINE":
		return "bg-red-500";
	  case "AWAY":
		return "bg-yellow-500";
	  case "INGAME":
		return "bg-blue-500";
	  default:
		return "";
	}
  }

const PasswordSettings: React.FC<PasswordSettingsProps> = ({
	channel,
	showPasswordContainer,
	setShowPasswordContainer,
	ChangePwd,
	setChangePwd,
	addPassword,
	setAddPassword,
	setPassword,
	passwordMismatch,
	setPasswordMismatch,
	password,
	updateChannel
}) => {

	const handlePasswordSubmit = async () => {

		console.log('Password submitted:', password);
		if (addPassword) {
			if (password === '' || password === undefined || (typeof password === 'string' && password.trim() === '')) {
				setPasswordMismatch(true);
				return;
			}
			const salt = bcrypt.genSaltSync(10);
			channel.password =  bcrypt.hashSync(password, salt);
			channel.type = "PROTECTED";
			updateChannel(channel);
			setAddPassword(false);

		} else if (ChangePwd) {
			if (password === '' || password === undefined || (typeof password === 'string' && password.trim() === '')) {
				setPasswordMismatch(true);
				return;
			}
			const salt = bcrypt.genSaltSync(10);
			channel.password =  bcrypt.hashSync(password, salt);
			updateChannel(channel);
			setChangePwd(false);

		} else {
			const isMatch = await bcrypt.compare(password || '', channel.password || '');
			if (isMatch) {
				console.log("unmatched password");
				setPasswordMismatch(true);
				return;
			}			
		} 
		setShowPasswordContainer(false);
		setPasswordMismatch(false);
	};

	return (
		<>
			{showPasswordContainer && (
				<div className="absolute h-full z-50 bg-pink-400 backdrop-blur-md bg-opacity-50 w-full flex justify-center items-center inset-0 border rounded ${!showPasswordPrompt ? 'hidden' : ''}">
					<div className="bg-white p-5 space-y-3 bg-opacity-50 overflow-hidden rounded-md w-1/3">
						<div className="flex gap-2 justify-end mt-2"></div>
						{ChangePwd ? (
							<div className="flex flex-col gap-2">
								<input
									type="password"
									onChange={(e) => setPassword(e.target.value)}
									className="p-2 bg-white bg-opacity-30 text-white border-none outline-none rounded-lg placeholder-white" 
									placeholder="a"
								/>
							</div>			
						) : addPassword && (
							<div className="flex flex-col gap-2">
							<input
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								className="p-2 bg-white bg-opacity-30 text-white border-none outline-none rounded-lg placeholder-white" 
								placeholder="c"
							/>
						</div>
						)}
						{passwordMismatch && <p>Passwords do not match. Please try again.</p>}
						<div className="flex gap-2 justify-center">
							<div className="w-10">
								<button onClick={handlePasswordSubmit}>
									<MdOutlineCheckCircle className="w-10 h-10 text-white" />
								</button>
							</div>
							{(ChangePwd || addPassword)&& (
								<div className="w-10 aspect-square">
									<button onClick={() => {
										if (addPassword) {
											channel.type = "PRIVATE";
											channel.password = null;
										}
										setShowPasswordContainer(false);
										setPasswordMismatch(false);
										setChangePwd(false);
										setAddPassword(false);
										setPassword('');
									}}>
										<MdOutlineCancel className='w-10 h-10 text-white'/>
									</button>		
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

const ChannelSettings_1: React.FC<ChannelSettingsProps>  = ({
	channel,
	title,
	setTitle,
	description,
	setDescription,
	editTitle,
	setEditTitle,
	editDescription,
	setEditDescription,
	setAddPassword,
	setShowPasswordContainer,
	setLock,
	lock,
	setChangePwd,
	setNextPage,
	socket,
	members,
	admins,
	owner,
	updateChannel,
}) => {

	const [updateTitle] = useMutation(UPDATE_CHANNEL_TITLE);
	const [updateDescription] = useMutation(UPDATE_CHANNEL_DESCRIPTION);
	const [updtaeProfile] = useMutation(UPDATE_CHANNEL_PROFILE_IMAGE);
	function loadFile(event: ChangeEvent<HTMLInputElement>): void {
		const image = document.getElementById('output') as HTMLImageElement;
		if (image && event.target.files) {
			image.src = URL.createObjectURL(event.target.files[0]);
			// channel.icon = `*/${event.target.files[0].name}`;
			// console.log(channel.icon)
			// console.log(image.src)
		}
	}

	return (
		<>
			<div>
				<div className="flex flex-col gap-4">
					<div className="profile-pic mt-10">
						<label className="-label" htmlFor="file">
							<CiCamera/>
							<span>Change Image</span>
						</label>
						<input id="file" type="file" onChange={(event) => loadFile(event)}/>
						<img src={channel.icon} id="output" width="200" />
						<div className="lock-icon">
							<button 
							onClick={async () => { 
								if (owner?.name === user.username) {
									setLock(prevState => !prevState);
									if (!lock) {
										setAddPassword(true);
										setShowPasswordContainer(true);							
									} else if (lock) {
										console.log("hhhh");
										channel.type = "PUBLIC";
										channel.password = null;
										updateChannel(channel);
									}}}}
								className="p-2 rounded-full bg-pink-200 hover:bg-pink-300 transition duration-300">
								{lock ? <CiLock className="text-pink-500" /> : <CiUnlock className="text-pink-500" />}
							</button>
						</div>
					</div>
				</div>
				<div className="setTitleContainer">
					{editTitle ? (
						<input
						type="text"
						className="setTitleInput"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						maxLength={12}
						onKeyDown={async (e) => {
							if (e.key === "Enter")  {
								setEditTitle(false);
								if (title === undefined)
									console.log("title is undefined : ");
								if (title && title !== channel.title) {
									channel.title = title;
									await updateTitle({
										variables: {
											cid: channel.id,
											title,
										}										
									});
									setTitle('');
								}
							}
						}}
						autoFocus
						/>
					) : (
						<>
							{(admins.some(admin => admin.name === user.username) || owner?.name === user.username) && (
								<div onClick={() => setEditTitle(true)} className="searchImg">
									<FaPen className="text-white w-4 h-4 cursor-pointer" />
								</div>
							)}
							<span className="text-white inline-flex center ${editTitle ? 'hidden' : ''}">{channel.title}</span>
						</>
					)}										
				</div>

				<div className="descriptionContainer">
				{editDescription ? (
					<textarea
						placeholder="description ..."
						className="descriptionInput"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						autoFocus
						onKeyDown={async (e) => {
							if (e.key === "Enter") {
								setEditDescription(false);
								if (description !== channel.description && description !== '') {
									if (description)
										description.trim() !== '';
									channel.description = description;
									await updateDescription({
										variables: {
											cid: channel.id,
											description
										}
									});
									setDescription('');
								}
							}
						}}
						maxLength={100}
					/>
					) : (
						<>
						{(channel.admins.some(admin => admin.name === user.username) || channel.owner.name === user.username) && (
							<div onClick={() => setEditDescription(true)} className="searchImg mb-10 ml-3">
								<FaPen className="text-white w-4 h-4 cursor-pointer" />	
							</div>
						)}
							<span className="descriptionText">{channel.description ? channel.description : "set description"}</span>
						</>
					)}	
				</div>
				{channel.type === "PROTECTED" && channel.owner.name === user.username && (
					<div className="changePwd-container">
						<button className="font-Manrope text-white" onClick={() => {
							setChangePwd(true);
							setShowPasswordContainer(true);
						}}>
							Change Password
						</button>
					</div>		
				)}	
			</div><div className="members-container">
					<div className="friend-list">
					{members && members
					.filter((m) => m.id !== user.id )
					.map((member, index) => (
						<div key={index} className="friend-box">
							<div className="friend-profile" style={{ backgroundImage: `url(${member.icon})` }}></div>
							<div className="username-box">{`@${member.name}`}</div>
							<div className="level-indicator">{`Level ${Math.floor(Math.random() * 50)}`}</div>
							<div className="settings">
									<Dropdown
										channel={channel}
										socket={socket}
										admins={admins}
										owner={owner}
										memeberId={member.id}
									/>
							</div>
						</div>
					))}
					</div>
				</div>
				<div className="chevron-icon">
					<FaChevronRight className="w-10 h-10 text-white" onClick={()=>setNextPage(true)} />
				</div>										
		</>
	);
}

const ChannelSettings_2 = ({
	channel,
	setNextPage,
	socket,
	banned,
	muted,
	members,
	admins,
	owner,
}: {
	channel: channelType;
	setNextPage: React.Dispatch<React.SetStateAction<boolean>>;
	socket?: Socket;
	banned: {
		id: string;
		name: string;
		icon: string;
	}[];
	muted: {
		id: string;
		name: string;
		icon: string;
		duration?: number;
		isMuted?: boolean;
		isPermanent?: boolean;
	}[];
	members: {
		id: string;
		name: string;
		icon: string;
		status: string;
	}[];
	admins: {
		id: string;
		name: string;
		icon: string;
	}[];
	owner: {
		id: string;
		name: string;
		icon: string;
	};
}) => {
	console.log("admins : ", admins);
	console.log("owner : ", owner);
	// console.log("members : ", members);
	console.log("banned : ", banned);
	console.log("muted : ", muted);
	return (
		<div className="flex-container">
		{admins && (
			<div className="members-container-s scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
				{owner && (
					<div className="members-list">
						<h2 className="section-title">Moderators</h2>
						<div className="member-box" title={`@${owner.name}`}>
							<div className="member-profile" style={{ backgroundImage: `url(${owner.icon})` }}></div>
							<div className="role-tags-container">
								<div className="role-tag bg-owner c-owner border-owner">
									<p className="role-text">owner</p>
								</div>
								<div className="role-tag bg-admin c-admin border-admin">
									<p className="role-text">admin</p>
								</div>															
							</div>
						</div>
					</div>
				)}
				<div className="members-list">
					{admins && admins.map((admin, index) => (
						<div key={index} title={`@${admin.name}`} className="member-box">
							<div className="member-profile" style={{ backgroundImage: `url(${admin.icon})` }}></div>
							<div className="role-tags-container">
							<div className="role-tag bg-admin c-admin border-admin">
									<p className="role-text">admin</p>
							</div>
							</div>
						</div>
					))}
				</div>
			</div>										
		)}
		{muted?.length !== 0 && (
			<div className="members-container-s members-container-s scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
				{/* <h2 className="section-title">Mute List</h2> */}
				<div className="members-list">
				<h2 className="section-title">Mute List</h2>
					{muted?.map((mute, index) => (
						<div key={index} title={`@${mute.name}`} className="member-box">
							<div className="member-profile" style={{ backgroundImage: `url(${mute.icon})` }}></div>
							{( owner.name === user.username || admins.some(admin => admin.name === user.username)) && (
								<div className="role-tags-container">
									<div
										className="action-box bg-action c-action border-action"
										onClick={() => socket?.emit('UnmuteUser', { room: channel.id, user: mute.id })}
									>
										<p >unmute</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>										
		)}
		{banned?.length !== 0 && (
			<div className="members-container-s members-container-s scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
				<div className="members-list">
				<h2 className="section-title">Ban List</h2>
					{banned?.map((ban, index) => (
						<div key={index} title={`@${ban.name}`} className="member-box">
							<div className="member-profile" style={{ backgroundImage: `url(${ban.icon})` }}></div>
							{( owner.name === user.username || admins.some(admin => admin.name === user.username)) && (
								<div className="role-tags-container">
									<div
										className="action-box bg-action c-action border-action"
										onClick={() => socket?.emit('unbanUser', { room: channel.id, user: ban.id })}
									>
										<p >unban</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>										
		)}
		{/* friends list: to update */}
			<div className="members-container-s members-container-s scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
				<div className="members-list">
				<h2 className="section-title">Friend List</h2>
					{JSON.parse(localStorage.getItem('friends') || '[]')
					.filter((friend: any) => 
						!members.some((member: { name: string }) => member.name === friend.name) &&
						!(friend.blocken.includes(user.id) || friend.blocked.includes(user.id))
					)
					.map((friend: {id: string; name: string; icon: string; }, index: number) => (
						<div key={index} title={`@${friend.name}`} className="member-box">
							<div className="member-profile" style={{ backgroundImage: `url(${friend.icon})` }}></div>
							{( owner.name === user.username || admins.some(admin => admin.name === user.username)) && (
								<div className="role-tags-container">
									<div
										className="action-box bg-action c-action border-action"
										onClick={() => socket?.emit('add', { room: channel.id, user: friend.id })}
									>
										<p >add</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>	
			<div className="chevron-icon">
				<FaChevronLeft className="w-10 h-10 text-white" onClick={() => setNextPage(false)} />
			</div>
	</div>
	);
}

const Typing = () => {
	const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
  
	useEffect(() => {
	const boxes = document.querySelectorAll(".box") as NodeListOf<HTMLDivElement>;
	let interval = 100;

	const loading = () => {
		boxes.forEach((box, index) => {
			setTimeout(async () => {
				box.style.animation = "loading_anim 1s cubic-bezier(0,.59,.37,1)";
				await sleep(1000);
				box.style.animation = "";
			}, index * interval);
		});
	};

	loading();
	const loadingInterval = setInterval(loading, 1750);
  
	  return () => clearInterval(loadingInterval);
	}, []);
  
	return (
	  <div className="flex items-center justify-center content-center gap-2">
		<div className="box"><span className="txt"></span></div>
		<div className="box"><span className="txt"></span></div>
		<div className="box"><span className="txt"></span></div>
	  </div>
	);
  };


const setHoursDuration = ({ hours }: { hours: number }) => {
	const now = new Date(); // Current time
	const durationInMilliseconds = hours * 60 * 60 * 1000; // 7 hours in milliseconds
	const endTime = new Date(now.getTime() + durationInMilliseconds); // Calculate end time
	return endTime;
};

const Dropdown = ({
	channel,
	socket,
	admins,
	owner,
	memeberId,
}:{ 
	channel: channelType;
	socket?: Socket;
	admins: { id: string, name: string, icon: string }[]  | [];
	owner: { id: string, name: string, icon: string };
	memeberId: string;
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isDoubleOpen, setIsDoubleOpen] = useState(false);
	const [updateUserType] = useMutation(UPDATE_CHANNEL_TYPE_USER);
	const toggleDropdown = () => {
	  setIsOpen(!isOpen);
	  setIsDoubleOpen(false);
	};
	useEffect(() => {
		setIsDoubleOpen(false);
		setIsOpen(false);
	}, [memeberId]);
	const handleMute = ({hours}: {hours: number}) => {
		if (hours === 0)
			socket?.emit('muteUser', { room: channel.id, user: memeberId, duration: null, permanent: true });
		else
			socket?.emit('muteUser', { room: channel.id, user: memeberId, duration: setHoursDuration({ hours }), permanent: false });
	};

	return (
	  <div className="relative">
		<button className="settings-button" id="multiLevelDropdownButton" data-dropdown-toggle="multi-dropdown" onClick={toggleDropdown}>
			<HiDotsHorizontal className="moderator-icon" />
		</button>
		{/* Dropdown menu */}
		<div
		  id="multi-dropdown"
		  className={`${isOpen ? '' : 'hidden'} dropdown`}
		>
		  <ul className="dropdown-content" aria-labelledby="multiLevelDropdownButton">
			<li onClick={() => socket?.emit('DM', {id1: memeberId, id2: user.id})}>
			  <a className="block text-white border border-transparent rounded-tl-lg rounded-tr-lg hover:border-white">
				DM
			  </a>
			</li>
			<li>
			  <a className="block text-white border border-transparent rounded-tl-lg rounded-tr-lg hover:border-white" onClick={() => socket?.emit('inviteGame', {})}>
				Invite to game
			  </a>
			</li>
			<li>
			  <a href="#" className="block text-white border border-transparent rounded-tl-lg rounded-tr-lg hover:border-white">
				Block
			  </a>
			</li>
			{(owner.name === user.username || admins.some(admin => admin.name === user.username)) && (
				<><li>
					<button
						id="doubleDropdownButton"
						data-dropdown-toggle="doubleDropdown"
						data-dropdown-placement="right-start"
						type="button"
						className="block w-full text-white border border-transparent hover:border-white"
						onClick={() => setIsDoubleOpen(!isDoubleOpen)}
					>
						mute
						{isDoubleOpen ? <FaAngleUp className="dropdown-icon" /> : <FaAngleDown className="dropdown-icon" />}
					</button>
					<div
						id="doubleDropdown"
						className={`z-10 ${isDoubleOpen ? '' : 'hidden'} dropdown-content dropdown-right-start`}
					>
						<ul className="dropdown-content" aria-labelledby="doubleDropdownButton">
							<li>
								<a className="block text-white border border-transparent rounded-tl-lg rounded-tr-lg hover:border-white" onClick={() => handleMute({ hours: 7 })}>
									7h
								</a>
							</li>
							<li>
								<a className="block text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white" onClick={() => handleMute({ hours: 168 })}>
									1 week
								</a>
							</li>
							<li>
								<a className="block text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white" onClick={() => handleMute({ hours: 0 })}>
								Always
								</a>
							</li>
						</ul>
					</div>
				</li><li>
						<a className="block text-white border border-transparent hover:border-white" onClick={() => socket?.emit('banUser', { room: channel.id, user: memeberId })}>
							Ban
						</a>
					</li><li>
						<a className="block text-white border border-transparent hover:border-white" onClick={() => socket?.emit('kick', { room: channel.id, user: memeberId})}>
							Kick
						</a>
					</li>
					{owner.name === user.username && (
						<li>
							{admins.some((admin) => admin.id === memeberId) ? (
								<a
									className="block text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white"
									onClick={() => {socket?.emit('removeMod', { room: channel.id, user: memeberId })}}>
									Remove mod
								</a>
							) : (
								<a
									className="block text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white"
									onClick={() => socket?.emit('addMod', { room: channel.id, user: memeberId })}>
									Add mod
								</a>
							)}
						</li>
					)}
				</>
			)}
		  </ul>
		</div>
	  </div>
	);
  };

const Chat: React.FC<chatProps> = ({ id, channels, setChannels, setDisplay, setId }) => {
	const [password, setPassword] = useState('');
	const [lock, setLock] = useState(true);
	const [editTitle, setEditTitle] = useState(false);
	const [editDescription, setEditDescription] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [showPasswordContainer, setShowPasswordContainer] = useState(false);
	const [ChangePwd, setChangePwd] = useState(false);
	const [addPassword, setAddPassword] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [nextPage, setNextPage] = useState(false);
	const [inputMessage, setInputMessage] = useState('');
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [isTyping, setIsTyping] = useState(false);
	const [socket, setSocket] = useState<Socket>();
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	const [updatePassword] = useMutation(UPDATE_CHANNEL_PASSWORD);
	const [updateType] = useMutation(UPDATE_CHANNEL_TYPE);

	const channel: channelType = channels.find((channel: { id: string; }) => channel.id === id) || channels[0];
	if (!channel)
		setDisplay("");
	const [messages, setMessages] = useState<{id: string; text: string; sender: string; senderId: string; time: Date; read: boolean;}[]>(channel?.messages || []);
	const [members, setMembers] = useState<{id: string, name: string, icon: string, status: string, blocked: string[], blocken: string[]}[]>(channel?.members || []);
	const [banList, setBanList] = useState<{ id: string, name: string, icon: string }[]>(channel.banned || []);
	const [muteList, setMuteList] = useState<{ id: string, name: string, icon: string }[]>(channel.muted || []);
	const [modList, setModList] = useState<{ id: string, name: string, icon: string }[]>(channel.admins	|| []);
	const [owner, setOwner] = useState<{ id: string, name: string, icon: string }>(channel.owner || {});

	const updateChannel = async (channel: channelType) => {
	
		await updatePassword({
			variables: {
				cid: channel.id,
				password: channel.password !== null ? channel.password : '',
			}
		});
		await updateType({
			variables: {
				cid: channel.id,
				type: channel.type
			}
		});
	}

	/**
	 * add two fields to the user entity blocked and blocking to the quieried channels in channeltype and channel 
	 * add a use sate to store the blocked and the setter the blocking qont change no need to handle
	 * add a function to user service who takes uid and checks for 
	 */
	
	let member: any = undefined;
	if (channel.type === "DM")
		member = channel.members.find((member: { name: string; }) => member.name !== user.username);
	const memberListner = (
		data: {
			id: string;
			name: string;
			icon: string;
			status: string;
			blocked: string[];
			blocken: string[];
		},
		room: string,
		opt: number
	) => {
		console.log("data : ", data);
		console.log("opt : ", opt);
		if (opt === 1) {
			if (data.id === user.id) {
				// if the user is added to a room by another user add the room to the channels
				// based on the room id query the channel and add it to the channels
				const { data } = client.readQuery({
					query: CHANNEL_BY_ID,
					variables: { id: room }
				});
				console.log("data : ", data);
				setChannels((prevChannels: channelType[]) => {
					const channel: channelType = {
						id: data.channel.id,
						title: data.channel.title,
						description: data.channel.description,
						type: data.channel.type,
						password: data.channel.password,
						icon: data.channel.profileImage,
						updatedAt: data.channel.updatedAt,
						owner: {
							id: data.channel.owner.id,
							name: data.channel.owner.username,
							icon: data.channel.owner.avatar.filename
						},
						admins: data.channel.admins.map((admin: { id: string, username: string, avatar: {filename: string}}) => ({
							id: admin.id,
							name: admin.username,
							icon: admin.avatar.filename
						})),
						members: data.channel.members.map((member: { id: string, username: string, avatar: {filename: string}, status: string, blocked: { blockedUserId: string }[], blocking: { blockerId: string }[] }) => ({
							id: member.id,
							name: member.username,
							icon: member.avatar.filename,
							status: member.status,
							blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
							blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
						})),
						banned: data.channel.banned.map((banned: { id: string, username: string, avatar: {filename: string} }) => ({
							id: banned.id,
							name: banned.username,
							icon: banned.avatar.filename
						})),
						muted: data.channel.muted.map((muted: { id: string, username: string, avatar: {filename: string} }) => ({
							id: muted.id,
							name: muted.username,
							icon: muted.avatar.filename
						})),
						messages: data.channel.messages.map((message: { id: string, text: string, time: Date, sender: string, senderId: string }) => ({
							text: message.text,
							sender: message.sender,
							senderId: message.senderId,
							time: message.time,
							read: true,
							unread: 0
						})).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
					};
					return [...prevChannels, channel];
				});

			} else {
				setMembers((prevMembers: any) => [...prevMembers, data]);
				setChannels((prevChannels: any) => {
					const updatedChannels = prevChannels.map((channel: channelType) => {
						if (channel.id === id) {
							channel.members = [...channel.members, data];
						}
						return channel;
					});
					return updatedChannels;
				});
			}
		}
		else if (opt === 0) {
			setMembers((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
			setChannels((prevChannels: any) => {
				const updatedChannels = prevChannels.map((channel: channelType) => {
					if (channel.id === id) {
						channel.members = channel.members.filter((member: { id: string; }) => member.id !== data.id);
					}
					return channel;
				});
				return updatedChannels;
			});				
		}
			
		console.log("new members : ", members);
	}

	const adminListner = (data: {
			id: string;
			name: string;
			icon: string;
	}, opt: number) => {
		if (opt === 1) {
			setModList((prevMembers: any) => [...prevMembers, data]);
			// add the changes to channels
			setChannels((prevChannels: any) => {
				const updatedChannels = prevChannels.map((channel: channelType) => {
					if (channel.id === id) {
						channel.admins = [...channel.admins, data];
					}
					return channel;
				});
				return updatedChannels;
			});
		}
		else if (opt === 0) {
			setModList((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
			// add the changes to channels
			setChannels((prevChannels: any) => {
				const updatedChannels = prevChannels.map((channel: channelType) => {
					if (channel.id === id) {
						channel.admins = channel.admins.filter((admin: { id: string; }) => admin.id !== data.id);
					}
					return channel;
				});
				return updatedChannels;
			});
		}
	}

	const bannedListner = (
		data: {
			id: string;
			name: string;
			icon: string;
		},
		room: string,
		opt: number) => {
		if (opt === 1) {
			if (data.id === user.id) {
				// if the user is banned from the room he is in remove it from the channels
				setChannels((prevChannels: any) => prevChannels.filter((channel: { id: string; }) => channel.id !== room));
				setDisplay('');
			} else {
				setBanList((prevMembers: any) => [...prevMembers, data]);
				setMembers((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
				setChannels((prevChannels: any) => {
					const updatedChannels = prevChannels.map((channel: channelType) => {
						if (channel.id === id) {
							channel.banned = [...channel.banned, data];
							channel.members = channel.members.filter((member: { id: string; }) => member.id !== data.id);
						}
						return channel;
					});
					return updatedChannels;
				});				
			}
		}
		else if (opt === 0) {
			setBanList((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
			setChannels((prevChannels: any) => {
				const updatedChannels = prevChannels.map((channel: channelType) => {
					if (channel.id === id) {
						channel.banned = channel.banned.filter((banned: { id: string; }) => banned.id !== data.id);
					}
					return channel;
				});
				return updatedChannels;
			});
		}
			
	}

	const mutedListner = (data: {
			id: string;
			name: string;
			icon: string;
	}, opt: number) => {
		if (opt === 1) {
			setMuteList((prevMembers: any) => [...prevMembers, data]);
			setChannels((prevChannels: any) => {
				const updatedChannels = prevChannels.map((channel: channelType) => {
					if (channel.id === id) {
						channel.muted = [...channel.muted, data];
					}
					return channel;
				});
				return updatedChannels;
			});
		}
		else if (opt === 0) {
			setMuteList((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
			setChannels((prevChannels: any) => {
				const updatedChannels = prevChannels.map((channel: channelType) => {
					if (channel.id === id) {
						channel.muted = channel.muted.filter((muted: { id: string; }) => muted.id !== data.id);
					}
					return channel;
				});
				return updatedChannels;
			});
		}
			
	}

	const messageListner = (data: { id: string, sender: string, text: string, time: Date, senderId: string, read: boolean}, room: string) => {
		if (room !== id)
			return ;
		setMessages((prevMessages: any) => [...prevMessages, data]);
		// add the changes to channels
		setChannels((prevChannels: any) => {
			const updatedChannels = prevChannels.map((channel: channelType) => {
				if (channel.id === id) {
					const message = {
						id: data.id,
						text: data.text,
						sender: data.sender,
						senderId: data.senderId,
						time: data.time,
						read: (data.sender !== user.username)? true : false,
					};
					// if read is set to true decrease the unread count and update the read via a mutation or emit an event to the server
					// else if read is false emit an event to the server so that it can appear in the sidebar
					if (message.read)
						socket?.emit('readMessage', { messageId: message.id, userId: user.id, roomId: id });
					channel.messages = [...channel.messages, message];
					channel.messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

				}
				return channel;
			});
			// to mark the message as seen , check if the user is the receiver is in the chat (display = chat) and the dm is opened id = room
			updatedChannels.sort((a: any, b: any) => {
				const msg1 = a.messages.length > 0 ? a.messages[a.messages.length - 1].time : new Date(0); // replace 0 with the last updated time
				const msg2 = b.messages.length > 0 ? b.messages[b.messages.length - 1].time : new Date(0);
				return new Date(msg2).getTime() - new Date(msg1).getTime();
			  })

			// else
			// 	socket?.emit("unreadMessage", data.senderId); // listen on this event in the sidebar component
			return updatedChannels;
		});
	};

	const handleSendDm = async (roomId: string) => {
		if (channels.some((channel: { id: string; }) => channel.id === roomId)) {
			setId(roomId);
		} else {
			const { data } = await client.query({
				query: CHANNEL_BY_ID,
				variables: { id: roomId }
			});
			console.log("data : ", data);
			const newChannel = {
				id: data.ChannelById.id,
				title: data.ChannelById.title,
				description: data.ChannelById.description,
				type: data.ChannelById.type,
				password: data.ChannelById.password,
				icon: data.ChannelById.profileImage,
				updatedAt: data.ChannelById.updatedAt,
				members: data.ChannelById.members
				.map((member: { id: string, username: string, avatar: {filename: string}, status: string }) => ({
				  id: member.id,
				  name: member.username,
				  icon: member.avatar.filename,
				  status: member.status,
				})),
				muted: data.ChannelById.muted.map((muted: { id: string, username: string, avatar: {filename: string} }) => ({
				  id: muted.id,
				  name: muted.username,
				  icon: muted.avatar.filename
				})),
				messages: data.ChannelById.messages
				.map((message: { id: string, text: string, time: Date, sender: string , senderId: string}) => ({
				  text: message.text,
				  sender: message.sender,
				  senderId: message.senderId,
				  time: message.time,
				  read: true,
				  unread: 0
				})).sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime()),
			};
			setChannels((prevChannels: any) => {
				const updatedChannels = [...prevChannels, newChannel];
				// Sort the channels by the most recently updated
				updatedChannels.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
				setId(roomId);
				return updatedChannels;
			  });
		}
	};

	const handleBlock = (data: { blockerId: string, blockedUserId: string }) => {
		// if a user1 blocked user2 update the user2 blocken list with the user1 id and update the user1 blocked list with the user2 id
		setMembers((prevMembers: any) => {
			const updatedMembers = prevMembers.map((member: { id: string, blocked: string[], blocken: string[] }) => {
				if (member.id === data.blockerId) {
					member.blocked = [...member.blocked, data.blockedUserId];
				}
				if (member.id === data.blockedUserId) {
					member.blocken = [...member.blocken, data.blockerId];
				}
				return member;
			});
			return updatedMembers;
		});
	};

	// handle the messages read status once the user access the channel


	useEffect(() => {
		socket?.on('messageSent', messageListner);
		socket?.on('userAdded', memberListner);
		socket?.on('userRemoved', memberListner);
		socket?.on('adminAdded', adminListner);
		socket?.on('adminRemoved', adminListner);
		socket?.on('userBanned', bannedListner);
		socket?.on('userUnbanned', bannedListner);
		socket?.on('mutedAdded', mutedListner);
		socket?.on('mutedRemoved', mutedListner);
		socket?.on('dmCreated', handleSendDm);
		socket?.on('userBlocked', handleBlock);
		return () => {
			socket?.off('messageSent', messageListner);
			socket?.off('userAdded', memberListner);
			socket?.off('adminAdded', adminListner);
			socket?.on('adminRemoved', adminListner);
			socket?.off('userRemoved', memberListner);
			socket?.off('userBanned', bannedListner);
			socket?.off('userUnbanned', bannedListner);
			socket?.off('mutedAdded', mutedListner);
			socket?.off('mutedRemoved', mutedListner);
			socket?.off('dmCreated', handleSendDm);
			socket?.off('userBlocked', handleBlock);
		}
	}, [memberListner, adminListner, bannedListner, mutedListner, messageListner, handleSendDm, handleBlock]);

	useEffect(() => {
		setLock(channel.type !== "PUBLIC");
		setShowSettings(false);
		setNextPage(false);
		setMessages(channel.messages || []);
		setMembers(channel.members || []);
		setBanList(channel.banned || []);
		setMuteList(channel.muted || []);
		setModList(channel.admins || []);
		setOwner(channel.owner || {});
	}, [id, channels]);
	
	useEffect(() => {
        const newSocket = io('ws://localhost:3003/chat');
        setSocket(newSocket);

		if (newSocket && channel.id) {
			newSocket.emit('joinRoom', channel.id);
		}

        return () => {
            newSocket.disconnect();
        };
    }, [setSocket, id]);

	const handleSendMessage = () => {
        if (inputMessage.trim() !== '' && socket) {
            socket.emit('sendMessage', { room: channel.id, text: inputMessage, sender: user.id});
            setInputMessage('');
			if (isTyping)
				socket.emit('stopTyping', channel.id);
			scrollToBottom()
        }
    };

    useEffect(() => {
		scrollToBottom();
    }, [messages]);

	useEffect(() => {
		socket?.on('userTyping', (User: string, room: string) => {
			if (User !== user.id && id === room) {
				scrollToBottom();
				setIsTyping(true);
			}
		});
	
		socket?.on('userStoppedTyping', () => {
			setIsTyping(false);
		});
	
		return () => {
			socket?.off('userTyping');
			socket?.off('userStoppedTyping');
		};
	}, [socket]);

	useEffect(() => {
		console.log("hna : ", channel.messages);
		if (channel.messages) {
			// loop on the last unread message and set the read status to true
			const lastUnread = channel.messages.findIndex((message: { sender: string; }) => message.sender !== user.username);
			if (lastUnread !== -1) {
				const updatedMessages = channel.messages.map((message) => {
					if (message.sender !== user.username) {
						socket?.emit('readMessage', { messageId: message.id, userId: message.senderId, roomId: id });
						message.read = true;
					}
					return message;
				});
				setMessages(updatedMessages);
				// update the channel messages
				setChannels((prevChannels: any) => {
					const updatedChannels = prevChannels.map((channel: channelType) => {
						if (channel.id === id) {
							channel.messages = updatedMessages;
						}
						return channel;
					});
					return updatedChannels;
				});
			}
		}
	}, [id, socket]);
	
	// console.log("is typing : ", isTyping);

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	};

	const handleUserInput = () : boolean => {
		let isBlocked = false;
		if (channel.type === 'DM' && member) {
			if (member.blocken?.includes(user.id) || member.blocked?.includes(user.id)) {
				isBlocked = true;
			}
		}
		return isBlocked;
	}

	return (
		<>
		<div className="w-full h-full col-12 col-md-8 col-lg-7 col-xl-6 px-0 pl-md-1 z-10">
				<div className="w-full h-full">
					
					<PasswordSettings 
						channel={channel} 
						showPasswordContainer={showPasswordContainer} 
						setShowPasswordContainer={setShowPasswordContainer} 
						ChangePwd={ChangePwd} 
						setChangePwd={setChangePwd} 
						addPassword={addPassword} 
						setAddPassword={setAddPassword} 
						setPassword={setPassword} 
						passwordMismatch={passwordMismatch} 
						setPasswordMismatch={setPasswordMismatch} 
						password={password}
						updateChannel={updateChannel}
						/>
					<div className="wrapper py-2 pt-mb-2 pb-md-3">
						<div className="w-full border-b border-white flex justify-between items-center pb-2 pb-md-2 pl-2 pl-md-4 pr-2 ">
							<div className="flex-grow pl-2 pl-md-0">
								<div className="w-full h-full flex justify-start items-center">
									<div className="relative w-10 h-10">
										{channel.type === "DM" ? (
											<>
												<img src={member?.icon} className="rounded-full w-full h-full object-cover" />
												<span className={`status ${getStatusColor(member?.status || '')}`} />
											</>
										) : (
											<img src={channel.icon}  className="rounded-full w-full h-full object-cover" />
										)}
									</div>
									<div className="member--details">
										<span className="member--name">{member === undefined ? channel.title : member.name}</span>
									</div>
								</div>
							</div>
							<div className="chat__actions mr-2 ">
								<ul className="m-0">
									{["PUBLIC", "PRIVATE", "PROTECTED"].includes(channel.type) && (
										<>
											<li onClick={() => {
												if (!channel.muted.some((muted: { name: string; }) => muted.name === user.username))
													setShowSettings(prevState => !prevState);
												}
											}>
											<IoSettingsSharp className="w-10 h-10" />
											</li>
											<li>
												<IoExit
													className="w-10 h-10"
													onClick={() => {
														socket?.emit('leaveRoom', { room: channel.id, user: user.id });
														setChannels((prevState) => prevState.filter((Ch: { id: string; }) => Ch.id !== channel.id));
														setDisplay('');
													}}
												/>
											</li>
										</>
									)}
									{channel.type === "DM" && !(member?.blocken?.includes(user.id) || member?.blocked?.includes(user.id)) && (
										<>
											{channel.muted?.find((mute: any) => mute.id === member?.id)  ? (
												<li
													onClick={() => {
														socket?.emit('UnmuteUser', { room: channel.id, user: member?.id});
													}}
												>
													<HiOutlineSpeakerWave className="w-10 h-10" />
												</li>

											) : !channel.muted?.find((mute: any) => mute.id === user.id) && (

													<><li
													onClick={() => {
														socket?.emit('muteUser', { room: channel.id, user: member?.id, duration: null, permanent: true });
													} }><IoVolumeMuteSharp className="w-10 h-10" /></li><li
														className="chat__details d-flex d-xl-none"
													>
														<GiPingPongBat className="w-10 h-10" />
													</li></>
											) }

											<li
												className="chat__details d-none d-xl-flex"
												onClick={() => {
													socket?.emit('blockUser', {blockerId: user.id, blockedUserId: member?.id});
												}}
											>
												<MdBlock className="w-10 h-10" />
											</li>
										</>
									)}
								</ul>
							</div>
						</div>
						<div className="flex-grow overflow-y-auto pt-4 px-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent" ref={chatContainerRef}>
							{(showSettings && !nextPage) && channel.type !== 'DM' ? (
								<ChannelSettings_1
									channel={channel}
									socket={socket}
									title={title}
									setTitle={setTitle}
									description={description}
									setDescription={setDescription}
									editTitle={editTitle}
									setEditTitle={setEditTitle}
									editDescription={editDescription}
									setEditDescription={setEditDescription}
									setAddPassword={setAddPassword}
									setShowPasswordContainer={setShowPasswordContainer}
									setLock={setLock}
									lock={lock}
									setChangePwd={setChangePwd}
									setNextPage={setNextPage}
									members={members}
									admins={modList}
									owner={owner}
									updateChannel={updateChannel}
								/>
							) : (showSettings && nextPage) && channel.type !== 'DM' ? (
								<ChannelSettings_2 
										channel={channel}
										setNextPage={setNextPage}
										socket={socket}
										banned={banList}
										muted={muteList}
										members={members}
										admins={modList}
										owner={owner}
								/>
							) : (
								<ul className="messages-list">
								{messages
								.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime())
								.filter((message: { senderId: string; }) => {
									let bool = true;
									if (channel.type !== 'DM' && message.senderId !== user.id) {
										members.find((member) => {
											if (member.id === user.id) {
												if (member.blocken?.includes(message.senderId) || member.blocked?.includes(message.senderId))
												bool = false;
											}
										});
									}
									return bool;
								})
								.map((message, index) => (
									<li key={index}>
									<div className="message-container">
									
										{/* sender username */}
										{(["PUBLIC", "PRIVATE", "PROTECTED"].includes(channel.type) && message.sender !== user.username) && (
										<span className="sender-name">
											{message.sender}
										</span>
										)}
										<div>
											<div id="targetElement" className={message.sender === user.username ? "bubble bubble--response" : "bubble bubble--received"}>
											{message.text}
											</div>										
										</div>

										<span className={message.sender === user.username ? "response-time time-msg" : "received-time time-msg"}>
											{new Date(message.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}	
										</span>
									</div>
									</li>
								))}
								{isTyping && (
									<div className="bubble bubble--received">
										<Typing />
									</div>
								)}
								</ul>
							)}
						</div>
						<div className="flex justify-between items-center px-2 px-md-3 pt-1 pt-md-3">
							{!showSettings && (
								<div className="send-wrapper">
								{channel.muted.some((muted: { name: string; }) => muted.name === user.username) ? (
										<>
											<span className="w-full pl-5 text-white">You are muted in this channel</span>
											<IoBanSharp className="send-action" />
										</>
									) : handleUserInput() ? (
										<>
											<span className="w-full pl-5 text-white">You can't contact this user</span>
											<IoBanSharp className="send-action" />							
										</>
									) : (
										<>
											<input
												type="text"
												className="w-full bg-transparent outline-none pl-5 placeholder-white text-white"
												placeholder="Type a message"
												value={inputMessage}
												onChange={(e) => {
							
													if (e.target.value === '') {
														setInputMessage(e.target.value);
														socket?.emit('stopTyping', channel.id);
														return ;
													}
													setInputMessage(e.target.value);
													socket?.emit('typing', { room: channel.id, user: user.id });
												}}
												onBlur={() => {socket?.emit('stopTyping', channel.id);}}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														handleSendMessage();
														setIsTyping(false);
												}}}
											/>
											<button
												type="submit"
												className="text-white bg-white border-none rounded-full p-2 cursor-pointer"
												onClick={handleSendMessage}>
													<IoSend className="send-action" />
											</button>
										</>
									)}
								</div>								
							)}

						</div>
					</div>
				</div>
			</div>
		</>
    );
};

export default Chat;