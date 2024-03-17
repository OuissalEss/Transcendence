import { IoLockClosed } from "react-icons/io5";

interface ChannelItem {
	title: string;
	icon: string;
	type: string;
	description?: string;
  }
  
  interface joinRoomProps {
	channelsItems: ChannelItem[];
  }
  
  const JoinRoom: React.FC<joinRoomProps> = ({
	channelsItems,
  }) => {
  
	return (
	  <div className="channels-container">
		<div className="channel-list">
		  {channelsItems.map((channel, index) => (
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
				  {channel.type === 'protected' ? (
					<button className="channel-request accept-request">Send Request</button>
				  ) : channel.type === 'public' ? (
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