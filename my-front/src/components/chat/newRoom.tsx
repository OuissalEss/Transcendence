import { ChangeEvent, useState } from "react";
import { CiCamera, CiLock, CiUnlock } from "react-icons/ci";
import { HiUserGroup } from "react-icons/hi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineAddModerator, MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";

interface NewRoomProps {
  friendsItems: {
    name: string;
    icon: string;
  }[];
  lock: boolean;
  toggleLock: () => void;
  setShowPasswordContainer: React.Dispatch<React.SetStateAction<boolean>>;
  showPasswordContainer: boolean;

}

const NewRoom: React.FC<NewRoomProps> = ({
  friendsItems,
  lock,
  toggleLock,
  setShowPasswordContainer,
  showPasswordContainer,
}) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const handlePasswordSubmit = () => {
    console.log('Password submitted:', password);
    if (password !== password2) {
      console.log("unmatched password");
      setPasswordMismatch(true);
      return;
    }
    setShowPasswordContainer(false);
    setPasswordMismatch(false);
  };

  const handlePasswordDiscard = () => {
    setShowPasswordContainer(false);
    setPassword('');
    // toggleLock();
  };

  function loadFile(event: ChangeEvent<HTMLInputElement>): void {
		const image = document.getElementById('output') as HTMLImageElement;
		if (image && event.target.files) {
			image.src = URL.createObjectURL(event.target.files[0]);
		}
	}
  
  return (
    
    <div className="h-full w-full overflow-hidden relative flex flex-col justify-between rounded-2xl overflow-y-auto pt-4 px-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
        <div>
            <div className="flex flex-col gap-4">
              <div className="profile-pic">
                <label className="-label" htmlFor="file">
                  <CiCamera/>
                  <span>Change Image</span>
                </label>
                <input id="file" type="file" onChange={(event) => loadFile(event)}/>
                <img src="../../../public/assets/chatBanner.png" id="output" width="200" />
                <div className="lock-icon">
                  <button onClick={toggleLock} className="p-2 rounded-full bg-pink-200 hover:bg-pink-300 transition duration-300">
                    {!lock ? <CiLock className="text-pink-500" /> : <CiUnlock className="text-pink-600" />}
                  </button>
                </div>
              </div>
            </div>
            <span className="setTitleContainer">
                <input
                type="text"
                className="setTitleInput"
                placeholder="set room title ..."
                autoFocus
                />									
            </span>

            <div className="descriptionContainer">
              <input
                type="text"
                placeholder="description ..."
                className="descriptionInput"
              />	
            </div>
            
            <span className="members-container">
              <div className="friend-list">
                {friendsItems.map((friend, index) => (
                  <div key={index} className="friend-box">
                    <div className="friend-profile" style={{ backgroundImage: `url(${friend.icon})` }}></div>
                    <div className="username-box">{`@${friend.name}`}</div>
                    <div className="level-indicator">{`Level ${Math.floor(Math.random() * 50)}`}</div>
                    <button className="icon-button">
                      <MdOutlineAddModerator className="moderator-icon" />
                    </button>
                    <button className="icon-button">
                      <IoIosAddCircleOutline className="regular-member-icon" />
                    </button>
                    </div>))}
                </div>
              </span>
          </div>
      {!lock && showPasswordContainer && (
        <div className="absolute h-full z-50 bg-purple-400 backdrop-blur-md bg-opacity-50 w-full flex justify-center items-center inset-0">
          <div className="bg-white p-5 space-y-3 bg-opacity-50 overflow-hidden rounded-md w-1/3">
            <div className="flex gap-2 justify-end mt-2">
          </div>
            <div className="flex flex-col gap-2">
              <input type="password" onChange={(e) => setPassword(e.target.value)} className="p-2 bg-purple-400 bg-opacity-30 rounded-md text-white" placeholder="Enter a password" />
              <input type="password" onChange={(e) => setPassword2(e.target.value)}  className="p-2 bg-purple-400 bg-opacity-30 rounded-md text-white" placeholder="Re-enter a password" />
            </div>
            {passwordMismatch && <p>Passwords do not match. Please try again.</p>}
            <div className="flex gap-2 justify-center">
              <div className="w-10">
                <button onClick={handlePasswordSubmit}>
                  <MdOutlineCheckCircle className='w-10 h-10 text-white'/>
                </button>
              </div>
            <div className="w-10 aspect-square">
              <button onClick={handlePasswordDiscard}>
                <MdOutlineCancel className='w-10 h-10 text-white'/>
              </button>		
            </div>
          </div>
        </div>
      </div> )}
      </div>
  );
}

export default NewRoom;