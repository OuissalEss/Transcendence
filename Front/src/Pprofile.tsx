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
import Riri from './assets/Riri.png';
import { useNavigate } from 'react-router-dom';
import Leaderboard3 from './Leaderboard/Leaderboard3.png';

import './Pprofile.css';

function Pprofile()
 {const navigate = useNavigate();

  const handleHomeIconClick = () => {
    navigate('/dashboard');
  };
  return (
    <div className="Profile">
        <div className="Border1"></div>
        <div className="Border2"></div>
        <header className="Profile-header">
            <div className="PlayerBar"></div> 
            <div className="PlayerProfile">Riri's Profile</div>
            <div className="PlayerName">Riri</div>
            <img src={Riri} className="Riri" alt="Riri" />
            <div className="AddFriend">Add Friend</div>
            <img src={Leaderboard3} className="LB" alt="Leaderboard3" />
            <div className="PLevelTube">
                <div className="PLevelMarker">Lv.2</div>
                    <div className="PTube">
                        <div className="PLevelProgress"></div>
                    </div>
                    <div className="PLevelMarker">Lv.3</div>
            </div>
            <div className="PStats">
                <p className="PStatText">4&nbsp;Wins&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;5&nbsp;Draw&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;0&nbsp;Losses</p>
            </div>
            <div className="PAchievements">Achievements</div>
            <div className="PAchievementBar"></div>
            <div className="PPL">Playthrough Legacy</div>
            <div className="PPLBar"></div>
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

export default Pprofile;