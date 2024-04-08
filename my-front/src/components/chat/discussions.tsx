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

	// count unread messages
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
			if (message.sender !== user.username && !message.read) {
				unread++;
			}
		});
		return unread;
	};

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
				<div key={index} className="chat-box" onClick={() => {
					setId(channels[index].id);
					setDisplay("Chat");
				}}>
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