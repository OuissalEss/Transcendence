import FriendsBar from "../friendsBar/friendsBar";
import Sidebar from "../sideBar/sideBar";

function layout() {
	return (      
	<><div className='backgroundImage'></div>
	<div className="overlay bg-pink-300 opacity-50"></div>
	<div className="Title-container">
		<p className="Title">Chat</p>
	</div>
	<div className="flex h-screen">
		<div className="left-sidebar">
			<Sidebar />
		</div>
		<div className="right-sidebar">
			<FriendsBar />
		</div>
	</div></>
	);
}

export default layout;