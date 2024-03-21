import './Profile.css'
import LogoImage from './assets/Logo.png';
import GameIcon from './assets/GameIcon.png';
import ChatIcon from './assets/ChatIcon.png';
import SettingsIcon from './assets/SettingsIcon.png';
import LogoutIcon from './assets/LogoutIcon.png';
import InfosIcon from './assets/InfosIcon.png';
import Avatar from './assets/Avatar.png';
import SearchIcon from './assets/Search.png';
import Notification from './assets/Notification.png';
import HomeIcon from './assets/HomeIcon.png';
import Avatar2 from './assets/Avatar2.png';
import Avatar3 from './assets/Avatar3.png';
import Avatar4 from './assets/Avatar4.png';
import Avatar5 from './assets/Avatar5.png';
import Avatar6 from './assets/Avatar6.png';
import LeftMssg from './assets/LeftMssg.png';
import RightMssg from './assets/RightMssg.png'; 
import { useNavigate } from 'react-router-dom';
import FirstWithB from './Achievements/FirstfWithB.png';
import FiveWithB from './Achievements/FiveWithB.png';
import RobotWithB from './Achievements/RobotWithB.png';
import RoomWithB from './Achievements/RoomWithB.png';
import ThreeWithB from './Achievements/ThreeWithB.png';
import WelcomeWithB from './Achievements/WelcomeWithB.png';
import './Infos.css'

function Infos()
{
    const navigate = useNavigate();

  const handleHomeIconClick = () => {
    navigate('/dashboard');
  }
    return(
        <div className="Profile">
            <div className="Border1"></div>
            <div className="Border2"></div>
            <header className="Profile-header">
                <div className="InfoAchievements">Achievements</div>
            <div className="InfoAchievements">Achievements</div>
        <div className="InfoAchievementBar">
          <div className="IAchievement">
            <p>Welcome to the Arena: <br/>Log in for the first time <br/>and step onto the ping pong arena. <br/>You're now part of the game community!</p>
            <img src={WelcomeWithB} alt="Welcome Achievement" />
          </div>
          <div className="IAchievement">
            <p>Robo-Champion: <br/>Outsmarted the machine!<br/>Secure victory against a robot opponent<br/> and prove you're the ping pong master, human-style.</p>
            <img src={RobotWithB} alt="Robot Achievement" />
          </div>
          <div className="IAchievement">
            <p>Social Paddler: <br/>Make your first friend! <br/>Connect with another player to unlock this achievement<br/> and expand your ping pong network.</p>
            <img src={FirstWithB} alt="First Friend Achievement" />
          </div>
          <div className="IAchievement">
            <p>Winning Streak:<br/> Win five matches in a row without losing.</p>
            <img src={FiveWithB} alt="Five Win Streak Achievement" />
          </div>
          <div className="IAchievement">
            <p>Loyal Opponent: <br/>Play a match against the same friend three times. <br/>Friendly rivalries make the game more exciting!</p>
            <img src={ThreeWithB} alt="Three Matches Against Same Friend Achievement" />
          </div>
          <div className="IAchievement">
            <p>Team Spirit:<br/> Join a ping pong room for the first time. <br/>Teamwork makes the dream work!</p>
            <img src={RoomWithB} alt="Join Room Achievement" />
          </div>
        </div>
        <div className="AboutUs">About us 💕</div>
        <div className="AboutUsOuissal">
            <h1>Ouissal🐾</h1>
            <img src={RightMssg} className="RightMssg1"alt="RightMssg" />
        </div>
        <div className="AboutUsZineb">
            <h1>Zineb✨</h1>
            <img src={LeftMssg} className="LeftMssg1" alt="LeftMssg" />
        </div>
        <div className="AboutUsSalma">
            <h1>Salma🦋</h1>
            <img src={RightMssg} className="RightMssg2" alt="RightMssg" />
        </div>

                        <div className="SearchBar">
                    <img src={SearchIcon} className="SearchIcon" alt="SearchIcon" />
                    <input type="text" placeholder="Search for a player" className="SearchInput" />
                    </div>
                    <div className="NotificationBar">
                    <img src={Notification} alt="Notification" className="NotificationIcon" />
                    </div>
        <img
          src={HomeIcon}
          className="HomeIcon"
          alt="HomeIcon"
          onClick={handleHomeIconClick} 
        />
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
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
            </header>
        </div>
    );
}

export default Infos;