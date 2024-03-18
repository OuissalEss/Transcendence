import { IoSend } from "react-icons/io5";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { GiPingPongBat } from "react-icons/gi";
import { IoSettingsSharp, IoExit } from "react-icons/io5";
import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from "react";
import { IoBanSharp } from "react-icons/io5";
import { MdOutlineCheckCircle} from "react-icons/md";
import { MdOutlineAddModerator, MdOutlineCancel } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCamera, CiLock, CiUnlock } from "react-icons/ci";
import { IoCameraSharp } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight, FaPen } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdBlock } from "react-icons/md";
// import ChevronLeft from '../../../public/assets/Icons/ChevronLeft.png';
// import ChevronRight from '../../../public/assets/Icons/ChevronRight.png';




// admins cant be muted but can mute ban and kick others except the owner
// owner can do anything but can't be muted banned or kicked
// members cant mute ban or kick others they only can leave the channel
// only the owner can change the channels privacy



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


interface chatProps {
	channel: channelItems;
	setChannels: React.Dispatch<React.SetStateAction<channelItems[]>>;
	channels: channelItems[];
	index: number;
}

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

// const settings = (channel: channelItems) => {

// }

const Chat: React.FC<chatProps> = ({ channel, setChannels, channels, index }) => {
	const [inputMessage, setInputMessage] = useState('');
	const [showPasswordContainer, setShowPasswordContainer] = useState(false);
	const [ChangePwd, setChangePwd] = useState(false);
	const [addPassword, setAddPassword] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	const [password, setPassword] = useState('');
	const [lock, setLock] = useState(true);
	const [editTitle, setEditTitle] = useState(false);
	const [editDescription, setEditDescription] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [nextPage, setNextPage] = useState(false);

	useEffect(() => {
		// channel = channels[index];
		setLock(channel.type !== "public");
		setShowSettings(false);
		setNextPage(false);
		setShowPasswordContainer(channel.type === "protected");
		
	  }, [channel]);

	const handleMessageChange = (e: { target: { value: SetStateAction<string>; }; }) => {
		setInputMessage(e.target.value);
	  };
	
	const handleSendMessage = () => {
	if (inputMessage.trim() !== '') {
		const newMessage = {
		text: inputMessage,
		sender: 'me',
		time: new Date(),
		read: false,
		};
		channel.messages.push(newMessage);
		// channels[index].messages.push(newMessage);
		// setChannels([...channels]);
		setInputMessage('');
		scrollToBottom();
	}
	};
	
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
	

	const scrollToBottom = () => {
	if (chatContainerRef.current) {
		chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
	}
	};

	function loadFile(event: ChangeEvent<HTMLInputElement>): void {
		const image = document.getElementById('output') as HTMLImageElement;
		if (image && event.target.files) {
			image.src = URL.createObjectURL(event.target.files[0]);
			// channel.icon = `*/${event.target.files[0].name}`;
			console.log(channel.icon)
			console.log(image.src)
		}
	}
	
	const handleSaveTitle = () => {
		setEditTitle(false);
		console.log(title);
		if (title === undefined)
			console.log("title is undefined : ");
		console.log("title : ", title);
		if (title && title !== channel.title) {
			channel.title = title;
			// channels[index].title = title;
			// setChannels([...channels]);
			setTitle('');
		}
	};

	const handleSaveDescription = () => {
		setEditDescription(false);
		if (description !== channel.description) {
			if (description)
				description.trim() !== '';
			channel.description = description;
			setDescription('');
			// setChannels((prevState) => [...prevState]);
		}
	};

	

	return (
		<>
		<div className="w-full h-full col-12 col-md-8 col-lg-7 col-xl-6 px-0 pl-md-1 z-10">
				<div className="w-full h-full">
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
												channel.type = "private";
												channel.password = undefined;
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
					<div className="wrapper py-2 pt-mb-2 pb-md-3">
						<div className="w-full border-b border-white flex justify-between items-center pb-2 pb-md-2 pl-2 pl-md-4 pr-2 ">
							<div className="flex-grow pl-2 pl-md-0">
								<div className="w-full h-full flex justify-start items-center">
									<div className="relative w-10 h-10">
										<img src={channel.icon}  className="rounded-full w-full h-full object-cover" />
										{channel.type === "dm" && (
											<span className={`status ${getStatusColor(channel.status || '')}`} />
										)}
									</div>
									<div className="member--details">
										<span className="member--name">{channel.title}</span>
									</div>
								</div>
							</div>
							<div className="chat__actions mr-2 ">
								<ul className="m-0">
									{["public", "private", "protected"].includes(channel.type) && (
										<>
											<li onClick={() => { if (channel.muted?.some(muted => muted.name !== "me") || channel.muted === undefined) setShowSettings(prevState => !prevState); } }><IoSettingsSharp className="w-10 h-10" /></li>
											<li> <IoExit className="w-10 h-10"/> </li> {/* on exit the channel records will be deleted from the users data */}
										</>
									)}
									{channel.type === "dm" && (
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
								
								<><div>
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
													if (channel.owner?.name === "me") {
														setLock(prevState => !prevState);
														if (!lock) {
															setAddPassword(true);
															setShowPasswordContainer(true);							
														} else if (lock) {
															channel.type = "public";
															channel.password = undefined;
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
											onBlur={handleSaveTitle}
											onKeyDown={(e) => {
												if (e.key === "Enter")
													handleSaveTitle();
											}}
											autoFocus
											/>
										) : (
											<>
												{(channel.admins?.some(admin => admin.name === "me") || channel.owner?.name === "me") && (
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
												if (e.key === "Enter")
												handleSaveDescription()
											}}
											autoFocus
										/>
										) : (
											<>
											{(channel.admins?.some(admin => admin.name === "me") || channel.owner?.name === "me") && (
												<div onClick={() => setEditDescription(true)} className="searchImg mb-10 ml-3">
													<FaPen className="text-white w-4 h-4 cursor-pointer" />	
												</div>
											)}
												<span className="text-white inline-flex center">{channel.description ? channel.description : "set description"}</span>
											</>
										)}	
									</div>
									{channel.type === "protected" && channel.owner?.name === "me" && (
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
										{channel.members && channel.members.map((member, index) => (
											<div key={index} className="friend-box">
												<div className="friend-profile" style={{ backgroundImage: `url(${member.icon})` }}></div>
												<div className="username-box">{`@${member.name}`}</div>
												<div className="level-indicator">{`Level ${Math.floor(Math.random() * 50)}`}</div>
												<div className="settings">
													<button className="settings-button">
														<HiDotsHorizontal className="moderator-icon" />
													</button>
													{(channel.admins?.some(admin => admin.name === "me") || channel.owner?.name === "me") ? (
														<div className="dropdown hidden">
															<ul className="dropdown-content">
																{channel.owner?.name === "me" && (
																	<>
																		<li className="text-white border border-transparent rounded-tl-lg rounded-tr-lg hover:border-white">add admin</li> 
																		<li className="text-white border border-transparent hover:border-white">remove admin</li>																	
																	</>
																)}													

																<li className="text-white border border-transparent hover:border-white">kick</li>
																<li className="text-white border border-transparent hover:border-white">
																	<a>mute</a>
																	<ul className="hidden">
																		<li className="text-white border border-transparent hover:border-white">7h</li>
																		<li className="text-white border border-transparent hover:border-white">1 week</li>
																		<li className="text-white border border-transparent hover:border-white">always</li>
																	</ul>
																</li>
																<li className="text-white border border-transparent hover:border-white">ban</li>
																<li className="text-white border border-transparent rounded-bl-lg rounded-br-lg hover:border-white">dm</li>
															</ul>
														</div>															
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
									{(channel.admins?.some(admin => admin.name === "me") || channel.owner?.name === "me") && (
										<div className="chevron-icon">
											<FaChevronRight className="w-10 h-10 text-white" onClick={()=>setNextPage(true)} />
										</div>										
									)}
									</>
							) : (showSettings && nextPage) ? (
								<div className="flex-container">
									{channel.admins && (
										<div className="members-container-s scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
											{channel.owner && (
												<div className="members-list">
													<h2 className="section-title">Moderators</h2>
													<div className="member-box" title={`@${channel.owner.name}`}>
														<div className="member-profile" style={{ backgroundImage: `url(${channel.owner.icon})` }}></div>
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
												{channel.admins && channel.admins.map((admin, index) => (
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
									{channel.muted && (
										<div className="members-container-s ">
											{/* <h2 className="section-title">Mute List</h2> */}
											<div className="members-list">
											<h2 className="section-title">Mute List</h2>
												{channel.muted && channel.muted.map((mute, index) => (
													<div key={index} title={`@${mute.name}`} className="member-box">
														<div className="member-profile" style={{ backgroundImage: `url(${mute.icon})` }}></div>
														<div className="action-box bg-action c-action border-action">
																<p>unmute</p>
														</div>
														</div>
												))}
											</div>
										</div>										
									)}
									{channel.banned && (
										<div className="members-container-s">
											<div className="members-list">
											<h2 className="section-title">Ban List</h2>
												{channel.banned && channel.banned.map((ban, index) => (
													<div key={index} title={`@${ban.name}`} className="member-box">
														<div className="member-profile" style={{ backgroundImage: `url(${ban.icon})` }}></div>
														<div className="role-tags-container">
														<div className="action-box bg-action c-action border-action">
																<p >unban</p>
														</div>
														</div>
													</div>
												))}
											</div>
										</div>										
									)}
									{( (channel.owner && channel.owner.name === "me") || (channel.admins && channel.admins.some(admin => admin.name === "me"))) && (
										<div className="chevron-icon">
											<FaChevronLeft className="w-10 h-10 text-white" onClick={() => setNextPage(false)} />
										</div>
									)}
									</div>
							) : (
								<ul className="messages-list">
									{channel.messages.sort((a, b) => Number(a.time) - Number(b.time)).map((message, index) => (
										<li key={index}>
											<div className="message-container">
												{/* sender username */}
												{(["public", "private", "protected"].includes(channel.type) && message.sender !== 'me') && (
													<span className="sender-name">
														{message.sender}
													</span>
												)}
												<div className={message.sender === "me" ? "bubble bubble--response" : "bubble bubble--received"}>
													{message.text}
												</div>
												<span className={message.sender === "me" ? "response-time time-msg" : "received-time time-msg"}>
													{message.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
												</span>
											</div>
										</li>
									))}
								</ul>
							)}
						</div>
						<div className="flex justify-between items-center px-2 px-md-3 pt-1 pt-md-3">
							{!showSettings && (
								<div className="send-wrapper">
								{channel.muted?.some(muted => muted.name === "me") ? (
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
												onChange={handleMessageChange}
												onKeyDown={(e) => {if (e.key === "Enter") handleSendMessage();}}
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