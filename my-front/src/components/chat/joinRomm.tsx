import { useState } from "react";
import { IoLockClosed } from "react-icons/io5";
import { channelType, joinRoomProps } from "../../interfaces/props";

/**
 * TODO:
 * - Add the ability to join a room :
 *   - If the room is public, the user should be able to join the room directly addmember mutation is called on the current user
 * 		give setindex the newly added room index and set display to chat
 *  - If the room is protected, the user should be able to join the room by entering the password same steps above should be followed
 *  - Only display the rooms that the user is not a member of
 */

const JoinRoom: React.FC<joinRoomProps> = ({
	channelsItems,
}) => {
	const channels = JSON.parse(localStorage.getItem('channels') || '[]').filter((channel: { type: string }) => channel.type === 'PUBLIC' || channel.type === 'PROTECTED');

	console.log('Channels:', channels);

	const [passwordInputs, setPasswordInputs] = useState<{ [key: string]: boolean }>({}); // Add index signature to passwordInputs

	const [password, setPassword] = useState('');

	const togglePasswordInput = (channelId: string) => {
		setPasswordInputs((prevInputs: { [key: string]: boolean }) => ({
			...prevInputs,
			[channelId]: !prevInputs[channelId],
		}));
	};

	const handleSubmitPassword = (e: React.FormEvent<HTMLInputElement>, channelId: string): void => {
		e.preventDefault();
		console.log('Password submitted for channel', channelId, ':', password);
		setPasswordInputs((prevInputs: { [key: string]: boolean }) => ({
			...prevInputs,
			[channelId]: false,
		}));
		setPassword('');
	};

	return (
		<div className="channels-container">
			<div className="channel-list">
				{channels.map((channel: channelType, index: number) => (
					(channel.type !== 'dm' && channel.type !== 'private') && (
						<div key={index} className="channel-box">
							<div className="channel-profile" style={{ backgroundImage: `url(${channel.icon})` }}>
								{channel.type === 'protected' && <IoLockClosed />}
							</div>
							<div className="title-box">{channel.title}</div>
							<div className="description-box">
								{channel.description ? (
									channel.description.length > 30 ? (
										`${channel.description.slice(0, 30)}...`
									) : (
										channel.description
									)
								) : (
									'Join the community !'
								)}
							</div>
							<div className="request-btn-row">
								{channel.type === 'PROTECTED' ? (
									<>
										{passwordInputs[channel.id] ? (
											<form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmitPassword(e as unknown as React.FormEvent<HTMLInputElement>, channel.id)}>
												
												<input
													type="password"
													placeholder="Password"
													className="channel-request accept-request"
													value={password}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
													onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
														if (e.key === 'Enter') {
															// setPassword(e.currentTarget.value);
															handleSubmitPassword(e as unknown as React.FormEvent<HTMLInputElement>, channel.id);
														}
													}}
												/>
												<button type="submit" className="channel-request accept-request">submit</button>
											</form>
										) : (
											<button
												className="channel-request accept-request"
												onClick={() => togglePasswordInput(channel.id)}
											>
												Join Room
											</button>
										)}
									</>
								) : channel.type === 'PUBLIC' ? (
									<button className="channel-request accept-request">Join Room</button>
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