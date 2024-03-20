import './Profile.css'
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
import { useNavigate } from 'react-router-dom';
import FirstfWithoutB from './Achievements/FirstfWithoutB.png';
import FiveWithoutB from './Achievements/FiveWithoutB.png';
import RobotWithoutB from './Achievements/RobotWithoutB.png';
import RoomWithoutB from './Achievements/RoomWithoutB.png';
import ThreeWithoutB from './Achievements/ThreeWithoutB.png';
import WelcomeWithoutB from './Achievements/WelcomeWithoutB.png';
import Leaderboard1 from './Leaderboard/Leaderboard1.png';
import ChevRight from './assets/ChevRight.png';
import ChevLeft from './assets/ChevLeft.png';
import Fr1 from './assets/Fr1.png';
import Fr2 from './assets/Fr2.png';
import Fr3 from './assets/Fr3.png';
import Fr4 from './assets/Fr4.png';
import CircleSettings from './assets/CircleSettings.png';
import React, { useState } from 'react';

function Profile() {
  const achievements = [WelcomeWithoutB, FiveWithoutB, ThreeWithoutB, FirstfWithoutB, RobotWithoutB, RoomWithoutB];
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const handlePrevAchievement = () => {
    const newIndex = currentAchievementIndex === 0 ? achievements.length - 1 : currentAchievementIndex - 1;
    setCurrentAchievementIndex(newIndex);
  };

  const handleNextAchievement = () => {
    const newIndex = (currentAchievementIndex + 1) % achievements.length;
    setCurrentAchievementIndex(newIndex);
  };

  const navigate = useNavigate();

  const handleHomeIconClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="Profile">
      <div className="Border1"></div>
      <div className="Border2"></div>
      <header className="Profile-header">
        <div className="ProfileTitle">
          <h1>Profile</h1>
          <div className="ProfileBar"></div>
        </div>
        <div className="CurrTitle">
          <h1>Current Interplays</h1>
          <div className="CurrBar">
            <ul className="InterplaysList">
              <li><span role="img" aria-label="star">✨</span> +1! Level up</li>
              <li><span role="img" aria-label="heart">❤️</span> Just added a new friend Ouissal!</li>
              <li><span role="img" aria-label="trophy">🏆</span> Earned 50 points in the last game</li>
              <li><span role="img" aria-label="medal">🥇</span> Completed a new achievement: "Master Explorer"</li>
              <li><span role="img" aria-label="lightning">⚡</span> Unlocked a new character: "Thunderbolt"</li>
              <li><span role="img" aria-label="gift">🎁</span> Sent a gift to Jane Doe</li>
              <li><span role="img" aria-label="ribbon">🎗️</span> Received a special reward for logging in</li>
              <li><span role="img" aria-label="gamepad">🎮</span> Reached a new milestone: 100 games played</li>
              <li><span role="img" aria-label="rocket">🚀</span> Joined a multiplayer match</li>
              <li><span role="img" aria-label="camera">📸</span> Updated profile picture</li>
            </ul>
          </div>
        </div>
        <div className="FrLiTitle">
          <h1>Friends List</h1>
          <div className="FrLiBar">
            <ul className="FriendsList">
              <li>
                <img src={Fr1} className="FriendAvatar" alt="Friend1" />
                <span className="FriendName">John</span>
                <img src={CircleSettings} className="CircleSettings" alt="Settings" />
              </li>
              <hr className="Separator" />
              <li>
                <img src={Fr2} className="FriendAvatar" alt="Friend2" />
                <span className="FriendName">Miley</span>
                <img src={CircleSettings} className="CircleSettings" alt="Settings" />
              </li>
              <hr className="Separator" />
              <li>
                <img src={Fr3} className="FriendAvatar" alt="Friend3" />
                <span className="FriendName">Emily</span>
                <img src={CircleSettings} className="CircleSettings" alt="Settings" />
              </li>
              <hr className="Separator" />
              <li>
                <img src={Fr4} className="FriendAvatar" alt="Friend4" />
                <span className="FriendName">David</span>
                <img src={CircleSettings} className="CircleSettings" alt="Settings" />
              </li>
            </ul>
          </div>

        </div>
        <div className="AchievementsTitle">
          <h1>Achievements</h1>
          <div className="AchievementsBar">
            <div className="ChevLeft" onClick={handlePrevAchievement}>
            <img src={ChevLeft} alt="Left Chevron" className="ChevLeft" />
            </div>
          <div className="AchievementContainer">
        <img src={achievements[currentAchievementIndex]} className="Achievement" alt="Achievement" />
           </div>
        <div className="ChevRight" onClick={handleNextAchievement}>
         <img src={ChevRight} alt="Right Chevron" className="ChevRight" />
       </div>
      </div>

        </div>
          <div className="PTtitle">
            <h1>Playthrough Legacy</h1>
              <div className="PTBar"></div>
          </div>
              
                <div className="PlayerLeft">
                  <img src={Fr1} className="LeftPlayer" alt="LeftPlayer" />
                  <p className="PlayerName">John</p>
                </div>
                <p className="Score">2&nbsp;&nbsp;-&nbsp;&nbsp;5</p>
                <div className="PlayerRight">
                  <p className="PlayerName">Miley</p>
                  <img src={Fr2} className="RightPlayer" alt="RightPlayer" />
                </div>
                
        <div className="SearchBar">
          <img src={SearchIcon} className="SearchIcon" alt="SearchIcon" />
          <input type="text" placeholder="Search for a player" className="SearchInput" />
        </div>
        <div className="NotificationBar">
          <img src={Notification} alt="Notification" className="NotificationIcon" />
        </div>
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img src={GameIcon} className="GameIcon" alt="GameIcon" />
        <img src={ChatIcon} className="ChatIcon" alt="ChatIcon" />
        <img src={SettingsIcon} className="SettingsIcon" alt="SettingsIcon" />
        <img src={LogoutIcon} className="LogoutIcon" alt="LogoutIcon" />
        <img src={InfosIcon} className="InfosIcon" alt="InfosIcon" />
        <img src={Avatar} className="Avatar" alt="Avatar" />
        <img src={Avatar} className="AvatarPro" alt="Avatar" />
        <div className="ProfileName">
          <p>Stella</p>
        </div>
        <img src={Leaderboard1} className="LeaderboardPro" alt="Leaderboard1" />
        <div className="LevelTube">
          <div className="LevelMarker">Lv.5</div>
          <div className="Tube">
            <div className="LevelProgress"></div>
          </div>
          <div className="LevelMarker">Lv.6</div>
        </div>
        <div className="Stats">
          <p className="StatText">42Wins&nbsp;&nbsp;|&nbsp;&nbsp;1Draw&nbsp;&nbsp;|&nbsp;&nbsp;0Losses</p>
        </div>
        <img src={Avatar2} className="Avatar2" alt="Avatar2" />
        <img src={Avatar3} className="Avatar3" alt="Avatar3" />
        <img src={Avatar4} className="Avatar4" alt="Avatar4" />
        <img src={Avatar5} className="Avatar5" alt="Avatar5" />
        <img src={Avatar6} className="Avatar6" alt="Avatar6" />
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img
          src={HomeIcon}
          className="HomeIcon"
          alt="HomeIcon"
          onClick={handleHomeIconClick} 
        />
      </header>
    </div>
  );
}

export default Profile;
