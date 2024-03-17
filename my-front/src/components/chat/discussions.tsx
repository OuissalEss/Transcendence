import search from '../../../public/assets/Icons/Search.png';
import './chat.css';
import { IoLockClosed } from "react-icons/io5";
import { HiUserCircle } from "react-icons/hi";
import { FaRegClock } from "react-icons/fa";


interface discussionItems {
	title: string;
	icon: string;
	type: string;
	text: string;
	read: boolean;
	time: Date;
	unread: number;
	status?: string;
	sender?: string;
}

interface DiscussionsProps {
	setDisplay: React.Dispatch<React.SetStateAction<string>>;
	setIndex: React.Dispatch<React.SetStateAction<number>>;
	setDiscussion: React.Dispatch<React.SetStateAction<discussionItems[]>>;
	discussionItems: discussionItems[];
}

const Discussions: React.FC<DiscussionsProps> = ({
    setDisplay,
	setIndex,
	setDiscussion,
    discussionItems,
}) => {

    const handleButtonClick = (componentId: string) => {
        setDisplay(componentId);
    };

	function handleDiscussionClick(index: number): void {
		setIndex(index);
		setDisplay("Chat");
		discussionItems[index].unread = 0;
		discussionItems[index].read = true;
		setDiscussion([...discussionItems]);
		console.log("index :", index);
	}

    return (
        <div className="discussion-container z-10">
            <div className="fixed z-10 top-7 left-8">
                <p className="text-1">Discussions</p>
            </div>
            <div className='button-container'>
                <button className="transparent-button ml-3" onClick={() => handleButtonClick('JoinRoom')}>Join room</button>
                <button className="transparent-button mr-3" onClick={() => handleButtonClick('NewRoom')}>New room</button>
            </div>
            <span className="searchBarContainer">
                <div className="searchImg">
                    <img
                        src={search}
                        alt="search"
                        style={{ width: '20px', height: "auto" }}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="searchInput"
                />
            </span>
            <div className="chat-list">
			{discussionItems
				.map((discussion, index) => (
					<div key={index} className="chat-box" onClick={() => handleDiscussionClick(index)}>
						<div className="img-box">
							<img className="w-full h-full object-cover w-full h-full" src={discussion.icon}/>
						</div>
						{/* <span className={`status-indicator-1 ${getStatusColor(discussion.status)}`} /> */}
						<div className="chat-details">
							<div className="text-head">
								<h4>{discussion.title}</h4>
								<p className="time unread">{discussion.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
							</div>
						<div className="text-message">
							<p className={discussion.read ? "" : "unread"}>
								{discussion.sender ? (
									`${discussion.sender}: ${discussion.text.length > 30 ? discussion.text.slice(0, 30) + "..." : discussion.text}`
								) : (
									discussion.text.length > 30 ? discussion.text.slice(0, 30) + "..." : discussion.text
								)}								
							</p>

						{discussion.unread > 0 && (
                            <b>{discussion.unread}</b>
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