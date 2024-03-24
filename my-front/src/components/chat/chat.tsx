import { IoSend } from "react-icons/io5";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { GiPingPongBat } from "react-icons/gi";
import { IoSettingsSharp, IoExit } from "react-icons/io5";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoBanSharp } from "react-icons/io5";
import { MdOutlineCancel, MdOutlineCheckCircle} from "react-icons/md";
import { CiCamera, CiLock, CiUnlock } from "react-icons/ci";
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight, FaPen } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdBlock } from "react-icons/md";
import { chatProps, PasswordSettingsProps, ChannelSettingsProps } from "../../interfaces/props";
import {channelType} from "../../interfaces/props";
import io, { Socket } from 'socket.io-client';

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
 */


const user = JSON.parse(localStorage.getItem('user') || '{}');
const friendsList = JSON.parse(localStorage.getItem('friends') || '[]');

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
}) => {

	const handlePasswordSubmit = () => {
		console.log('Password submitted:', password);
		if (addPassword) {
			if (password === '' || password === undefined || (typeof password === 'string' && password.trim() === '')) {
				setPasswordMismatch(true);
				return;
			}
			channel.password = password;
			channel.type = "protected";
			setAddPassword(false);

		} else if (ChangePwd) {
			if (password === '' || password === undefined || (typeof password === 'string' && password.trim() === '')) {
				setPasswordMismatch(true);
				return;
			}
			channel.password = password;
			setChangePwd(false);

		} else {
			if (password !== channel.password) {
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
						) : addPassword ? (
							<div className="flex flex-col gap-2">
							<input
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								className="p-2 bg-white bg-opacity-30 text-white border-none outline-none rounded-lg placeholder-white" 
								placeholder="c"
							/>
						</div>
						) : (
							<div className="flex flex-col gap-2">
							<input
								type="password"
								onChange={(e) => setPassword(e.target.value)}
								className="p-2 bg-white bg-opacity-30 text-white border-none outline-none rounded-lg placeholder-white" 
								placeholder="b"
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
}) => {

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
							onClick={() => { 
								if (owner?.name === user.username) {
									setLock(prevState => !prevState);
									if (!lock) {
										setAddPassword(true);
										setShowPasswordContainer(true);							
									} else if (lock) {
										channel.type = "PUBLIC";
										channel.password = null;
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
						onKeyDown={(e) => {
							if (e.key === "Enter")  {
								setEditTitle(false);
								// console.log(title);
								if (title === undefined)
									console.log("title is undefined : ");
								// console.log("title : ", title);
								if (title && title !== channel.title) {
									channel.title = title;
									// channels[index].title = title;
									// setChannels([...channels]);
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
					<input
						type="text"
						className="descriptionInput"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								setEditDescription(false);
								if (description !== channel.description) {
									if (description)
										description.trim() !== '';
									channel.description = description;
									setDescription('');
									// setChannels((prevState) => [...prevState]);
								}
							}
						}}
						autoFocus
					/>
					) : (
						<>
						{(channel.admins.some(admin => admin.name === user.username) || channel.owner.name === user.username) && (
							<div onClick={() => setEditDescription(true)} className="searchImg mb-10 ml-3">
								<FaPen className="text-white w-4 h-4 cursor-pointer" />	
							</div>
						)}
							<span className="text-white inline-flex center">{channel.description ? channel.description : "set description"}</span>
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
					{members && members.map((member, index) => (
						<div key={index} className="friend-box">
							<div className="friend-profile" style={{ backgroundImage: `url(${member.icon})` }}></div>
							<div className="username-box">{`@${member.name}`}</div>
							<div className="level-indicator">{`Level ${Math.floor(Math.random() * 50)}`}</div>
							<div className="settings">
								{(admins?.some(admin => admin.name === user.username) || owner?.name === user.username) ? (
									<Dropdown
										channel={channel}
										socket={socket}
										admins={admins}
										owner={owner}
										memeberId={member.id}
									/>														
								) : (
									<div className="dropdown hidden">
										<ul className="dropdown-content">
											<li className="text-white border border-transparent hover:border-white">dm</li>
										</ul>
									</div>	
								)}
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
										onClick={() => socket?.emit('unmuteUser', { room: channel.id, user: mute.id })}
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
					.filter((friend: { name: string }) => !members.some((member: { name: string }) => member.name === friend.name))
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
	const toggleDropdown = () => {
	  setIsOpen(!isOpen);
	};
	const handleMute = ({hours}: {hours: number}) => {
    if (socket) {
			if (hours === 0)
      	socket.emit('muteUser', { room: channel.id, user: memeberId, duration: 0, permanent: true });
			else
				socket.emit('muteUser', { room: channel.id, user: memeberId, duration: setHoursDuration({ hours }), permanent: false });
    }
  };

	return (
	  <div className="relative" style={{zIndex: 30}}>
		<button className="settings-button" id="multiLevelDropdownButton" data-dropdown-toggle="multi-dropdown" onClick={toggleDropdown}>
			<HiDotsHorizontal className="moderator-icon" />
		</button>
		{/* Dropdown menu */}
		<div
		  id="multi-dropdown"
		  className={`z-10 ${isOpen ? '' : 'hidden'} dropdown`}
		>
		  <ul className="dropdown-content" aria-labelledby="multiLevelDropdownButton">
			<li>
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
							{admins.some((admin: { name: string }) => admin.name === user.username) ? (
								<a className="block text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white" onClick={() => socket?.emit('removeMod', { room: channel.id, user: memeberId })}>
									Remove mod
								</a>
							) : (
								<a className="block text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white" onClick={() => socket?.emit('addeMod', { room: channel.id, user: memeberId })}>
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

const Chat: React.FC<chatProps> = ({ id }) => {
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

	const channel = JSON.parse(localStorage.getItem('channels') || '[]').find((channel: { id: string }) => channel.id === id);
	const [messages, setMessages] = useState<{sender:string; text:string; time: Date;}[]>(channel.messages || []);
	const [members, setMembers] = useState<{id: string, name: string, icon: string, status: string}[]>(channel.members || []);
	const [banList, setBanList] = useState<{ id: string, name: string, icon: string }[]>(channel.ban || []);
	const [muteList, setMuteList] = useState<{ id: string, name: string, icon: string }[]>(channel.mute || []);
	const [modList, setModList] = useState<{ id: string, name: string, icon: string }[]>(channel.admins	|| []);
	const [owner, setOwner] = useState<{ id: string, name: string, icon: string }>(channel.owner || {});
	console.log("user : ", user.username)
	console.log("members : ", members)
	
	// console.log("messages : " + messages);
	let member = undefined;
	if (channel.type === "DM")
		member = channel.members.find((member: { name: string; }) => member.name !== user.username);

	const memberListner = (data: {
		id: string;
		name: string;
		icon: string;
		status: string;
	}, opt: number) => {
		console.log("data : ", data);
		console.log("opt : ", opt);
		if (opt === 1)
			setMembers((prevMembers: any) => [...prevMembers, data]);
		else if (opt === 0)
			setMembers((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
		console.log("new members : ", members);
	}

	const adminListner = (data: {
			id: string;
			name: string;
			icon: string;
	}, opt: number) => {
		if (opt === 1)
			setModList((prevMembers: any) => [...prevMembers, data]);
		else if (opt === 0)
			setModList((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
	}

	const bannedListner = (data: {
			id: string;
			name: string;
			icon: string;
	}, opt: number) => {
		if (opt === 1)
			setBanList((prevMembers: any) => [...prevMembers, data]);
		else if (opt === 0)
			setBanList((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
	}

	const mutedListner = (data: {
			id: string;
			name: string;
			icon: string;
	}, opt: number) => {
		if (opt === 1)
			setMuteList((prevMembers: any) => [...prevMembers, data]);
		else if (opt === 0)
			setMuteList((prevMembers: any) => prevMembers.filter((member: { id: string; }) => member.id !== data.id));
	}

	const messageListner = (data: {sender:string; text:string; time: Date;}) => {
		console.log("data : ", data);
		setMessages((prevMessages: any) => [...prevMessages, data]);
	};

	useEffect(() => {
		socket?.on('sendMessage', messageListner);
		socket?.on('userAdded', memberListner);
		socket?.on('userRemoved', memberListner);
		socket?.on('adminAdded', adminListner);
		socket?.on('bannedAdded', bannedListner);
		socket?.on('mutedAdded', mutedListner);
		
		return () => {
			socket?.off('sendMessage', messageListner);
			socket?.off('userAdded', memberListner);
			socket?.off('adminAdded', adminListner);
			socket?.off('bannedAdded', bannedListner);
			socket?.off('mutedAdded', mutedListner);
		}
	}, [memberListner, adminListner, bannedListner, mutedListner, messageListner]);
	useEffect(() => {
		// channel = channels[index];
		setLock(channel.type !== "PUBLIC");
		setShowSettings(false);
		setNextPage(false);
		setShowPasswordContainer(channel.type === "PROTECTED");
		setMessages(channel.messages || []);
	}, [id]);
	
	useEffect(() => {
        const newSocket = io('ws://localhost:3003/chat');
        setSocket(newSocket);

		if (newSocket && id) {
			newSocket.emit('joinRoom', id);
		}

        return () => {
            newSocket.disconnect();
        };
    }, [setSocket, id]);

	const handleSendMessage = () => {
        if (inputMessage.trim() !== '' && socket) {
            socket.emit('sendMessage', { room: id, text: inputMessage, sender: user.id});
            setInputMessage('');
			if (isTyping)
				socket.emit('stopTyping', channel.id);
			scrollToBottom();
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

	useEffect(() => {
		socket?.on('userTyping', (data) => {
			console.log("data : ", data);
			if (data !== user.id)
				setIsTyping(true);
		});
	
		socket?.on('userStoppedTyping', () => {
			setIsTyping(false);
		});
	
		return () => {
			socket?.off('userTyping');
			socket?.off('userStoppedTyping');
		};
	}, [socket]);
	
	// console.log("is typing : ", isTyping);

	const scrollToBottom = () => {
	if (chatContainerRef.current) {
		chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
	}
	};

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
						/>
					<div className="wrapper py-2 pt-mb-2 pb-md-3">
						<div className="w-full border-b border-white flex justify-between items-center pb-2 pb-md-2 pl-2 pl-md-4 pr-2 ">
							<div className="flex-grow pl-2 pl-md-0">
								<div className="w-full h-full flex justify-start items-center">
									<div className="relative w-10 h-10">
										{channel.type === "DM" ? (
											<>
												<img src={member.icon} className="rounded-full w-full h-full object-cover" />
												<span className={`status ${getStatusColor(member.status || '')}`} />
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
											<IoExit className="w-10 h-10"/>
											</li>
										</>
									)}
									{channel.type === "DM" && (
										<>
											<li ><IoVolumeMuteSharp className="w-10 h-10" /></li>
											<li className="chat__details d-flex d-xl-none"><GiPingPongBat className="w-10 h-10" /></li>
											<li className="chat__details d-none d-xl-flex"><MdBlock className="w-10 h-10" /></li>
										</>
									)}
								</ul>
							</div>
						</div>
						<div className="flex-grow overflow-y-auto pt-4 px-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent" ref={chatContainerRef}>
							{(showSettings && !nextPage) ? (
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
								/>
							) : (showSettings && nextPage) ? (
								<ChannelSettings_2 
										channel={channel}
										setNextPage={setNextPage}
										socket={socket}
										banned={banList}
										muted={muteList}
										members={members}
										admins={modList}
										owner={owner}
								></ChannelSettings_2>
							) : (
								<ul className="messages-list">
								{messages
								.sort((a: any, b: any) => new Date(a.time).getTime() - new Date(b.time).getTime())
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