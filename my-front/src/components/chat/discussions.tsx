import { useEffect } from 'react';
import { channelType, DiscussionsProps } from '../../interfaces/props';
import './chat.css';

// the discussions should be ordered by the most recntly updated

const Discussions: React.FC<DiscussionsProps> = ({
    setDisplay,
	setId,
	channels,
	setChannels,
}) => {
	// filter only channels that the user is a member of
	const user = JSON.parse(localStorage.getItem('user') || '{}');
	console.log(channels);

	function handleDiscussionClick(index: number): void {
		// update read and unread based on the channel id using setChannels



		// localStorage.setItem('channels', JSON.stringify(
		// 	JSON.parse(localStorage.getItem('channels') || '[]').map((channel: channelType) => {
		// 		if (channel.id === discussions[index].id) {
		// 			channel.messages.forEach((message: { sender: string, text: string, read: boolean }) => {
		// 				if (message.sender !== user.username && !message.read) {
		// 					message.read = true;
		// 					// message.unread = 0;
		// 				}
		// 			});
					
		// 			return channel; // Return the updated channel object
		// 		} else {
		// 			return channel; // Return the unchanged channel if not found
		// 		}
		// 	})
		// ));


		setId(channels[index].id);
		setDisplay("Chat");
	}

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
				<div key={index} className="chat-box" onClick={() => handleDiscussionClick(index)}>
					<div className="img-box">
					{discussion.type === 'DM' ? (
						discussion.members.map((member) => (
							member.name !== user.username && (
								<img key={member.id} className="w-full h-full object-cover w-full h-full" src={member.icon} alt={member.name} />
							)
						))
					) : (
						<img className="w-full h-full object-cover w-full h-full" src={discussion.icon} alt={discussion.title} />
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
							<p className="time unread">{new Date(discussion.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
						</div>
						<div className="text-message">
							<p className={discussion.messages.length > 0 && discussion.messages[discussion.messages.length - 1].read ? "" : "unread"}>
								{discussion.messages.length > 0 ? (
									`${discussion.messages[discussion.messages.length - 1].sender}: ${discussion.messages[discussion.messages.length - 1].text.length > 30 ? discussion.messages[discussion.messages.length - 1].text.slice(0, 30) + "..." : discussion.messages[discussion.messages.length - 1].text}`
								) : (
									discussion.type === 'DM' ? "Say hi to your friend" : "Say hi to your friends"
								)}
							</p>
							{discussion.messages.length > 0 && discussion.messages[discussion.messages.length - 1].unread > 0 && (
								<b>{discussion.messages[discussion.messages.length - 1].unread}</b>
							)}
						</div>
					</div>
				</div>
			))}

            </div>
        </div>
    );
}

function getStatusColor(status: string | undefined) {
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

export default Discussions;