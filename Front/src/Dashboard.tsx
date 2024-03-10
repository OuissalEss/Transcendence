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
import './Login.css';
import './Dashboard.css';


function Dashboard() {
  return (
    <div className="Login">
       <div className="Border1"></div>
        <div className="Border2"></div>
      <header className="Login-header">
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img src={HomeIcon} className="HomeIcon" alt="HomeIcon" />
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



export default Dashboard;
