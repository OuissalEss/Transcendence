import LogoImage from './assets/Logo.png';
import HomeIcon from './assets/HomeIcon.png';
import GameIcon from './assets/GameIcon.png';
import SettingsIcon from './assets/SettingsIcon.png';
import LogoutIcon from './assets/LogoutIcon.png';
import InfosIcon from './assets/InfosIcon.png';
import ChatIcon from './assets/ChatIcon.png';
import Avatar from './assets/Avatar.png';
import Avatar2 from './assets/Avatar2.png';
import Avatar3 from './assets/Avatar3.png';
import Avatar4 from './assets/Avatar4.png';
import Avatar5 from './assets/Avatar5.png';
import Avatar6 from './assets/Avatar6.png';
import SearchIcon from './assets/Search.png';
import Notification from './assets/Notification.png';
import OnlinePic from './Characters/Aurora/Challenge.png';
import OfflinePic from './Characters/Lumina/Challenge.png';
import Robot from './Characters/Pixie/Pixie.png';
import DashLeft from './Characters/Aurora/DashLeft.png';
import DashRight from './Characters/Aurora/DashRight.png';
import AuroraInfos from './Characters/Aurora/AuroraInfos.png';
import Top1 from './Avatars/Top1.png';
import Top2 from './Avatars/Top2.png';
import Top3 from './Avatars/Top3.png';
import Top4 from './Avatars/Top4.png';
import Top5 from './Avatars/Top5.png';
import Leaderboard1 from './Leaderboard/Leaderboard1.png';
import Leaderboard2 from './Leaderboard/Leaderboard2.png';
import Leaderboard3 from './Leaderboard/Leaderboard3.png';
import Leaderboard4 from './Leaderboard/Leaderboard4.png';
import Leaderboard5 from './Leaderboard/Leaderboard5.png';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import './Dashboard.css';


function Dashboard() {
  const navigate = useNavigate();

  const handleHomeIconClick = () => {
    navigate('/dashboard'); // Navigate to the Dashboard component
  };
  return (
    <div className="Login">
       <div className="Border1"></div>
        <div className="Border2"></div>
      <header className="Login-header">
      <div className="SearchBar">
        <img src={SearchIcon} className="SearchIcon" alt="SearchIcon" />
        <input type="text" placeholder="Search for a player" className="SearchInput" />
      </div>
      <div className="NotificationBar">
        <img src={Notification} alt="Notification" className="NotificationIcon" />
      </div>
      <div className="WelcomeMssg">
        <h1>Welcome, Stella!</h1>
      </div>
      <div className="Character">
        <h1>Character</h1>
        <div className="CharacterBar">
          <p>Aurora</p>
      </div> 
      </div>
      <div className="TopFivePlayers">
        <h1>Top 5 players</h1>
          <img src={Top1} alt="Top1" className="Top1" />
          <img src={Top2} alt="Top2" className="Top2" />
          <img src={Top3} alt="Top3" className="Top3" />
          <img src={Top4} alt="Top4" className="Top4" />
          <img src={Top5} alt="Top5" className="Top5" />
      </div>
        <div className="AvatarContainer1">
          <h1>Ethan</h1>
          <p>5.6k xp   |   42 wins</p>
        </div>
        <div className="AvatarContainer2">
          <h1>Slim</h1>
          <p>5.2k xp   |   38 wins</p>
        </div>
        <div className="AvatarContainer3">
          <h1>Olivia</h1>
          <p>4.9k xp   |   35 wins</p>
        </div>
        <div className="AvatarContainer4">
          <h1>Noah</h1>
          <p>4.7k xp   |   33 wins</p>
        </div>
        <div className="AvatarContainer5">
          <h1>Emma</h1>
          <p>4.5k xp   |   31 wins</p>
        </div>
      <div className="Question">
        <h1>Up for a game?</h1>
      </div>
      <div className="OnlineBar">
       <h1>Online</h1>
       <p>Challenge a <br></br> random player!</p>
        </div>
      <div className="OfflineBar">
        <h1>Offline</h1>
       <p>Challenge a <br></br> friend offline!</p>
      </div>
      <div className="RobotBar">
        <h1>Robot</h1>
        <p>Test your skills<br></br>against a robot!</p>
      </div>
      <div className="PlayNow1">
        <p>Play now</p>
      </div>
      <div className="PlayNow2">
        <p>Play now</p>
      </div>
      <div className="PlayNow3">
        <p>Play now</p>
      </div>
        <img src={OnlinePic} alt="OnlinePic" className="OnlinePic" /> 
        <img src={OfflinePic} alt="OfflinePic" className="OfflinePic" />
        <img src={Robot} alt="Robot" className="RobotPic" />
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img
          src={HomeIcon}
          className="HomeIcon"
          alt="HomeIcon"
          onClick={handleHomeIconClick} //
        />
        <img src={GameIcon} className="GameIcon" alt="GameIcon" />
        <img src={ChatIcon} className="ChatIcon" alt="ChatIcon" />
        <img src={SettingsIcon} className="SettingsIcon" alt="SettingsIcon" />
        <img src={LogoutIcon} className="LogoutIcon" alt="LogoutIcon" />
        <img src={InfosIcon} className="InfosIcon" alt="InfosIcon" />
        <img src={Avatar} className="Avatar" alt="Avatar" />
        <img src={Avatar2} className="Avatar2" alt="Avatar2" />
        <img src={Avatar3} className="Avatar3" alt="Avatar3" />
        <img src={Avatar4} className="Avatar4" alt="Avatar4" />
        <img src={Avatar5} className="Avatar5" alt="Avatar5" />
        <img src={Avatar6} className="Avatar6" alt="Avatar6" />
        <img src={DashLeft} className="DashLeft" alt="DashLeft" />
        <img src={DashRight} className="DashRight" alt="DashRight" />
        <img src={AuroraInfos} className="AuroraInfos" alt="AuroraInfos" />
        <img src={Leaderboard1} className="Leaderboard1" alt="Leaderboard1" />
        <img src={Leaderboard2} className="Leaderboard2" alt="Leaderboard2" />
        <img src={Leaderboard3} className="Leaderboard3" alt="Leaderboard3" />
        <img src={Leaderboard4} className="Leaderboard4" alt="Leaderboard4" />
        <img src={Leaderboard5} className="Leaderboard5" alt="Leaderboard5" />
  
      </header>
    </div>
  );
}



export default Dashboard;
