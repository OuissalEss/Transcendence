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
import Luna from './assets/Luna.png';
import LunaInfos from './assets/LunaInfos.png';
import Starlight from './assets/Starlight.png';
import StarlightInfos from './assets/StarlightInfos.png';
import Aegeon from './assets/Aegeon.png';
import AegeonInfos from './assets/AegeonInfos.png';
import Lumina from './assets/Lumina.png';
import LuminaInfos from './assets/LuminaInfos.png';
import Nova from './assets/Nova.png';
import NovaInfos from './assets/NovaInfos.png';
import Aurora from './assets/Aurora.png';
import AuroraInfos from './assets/AuroraInfos.png';
import ChevronLeft from './assets/ChevronLeft.png';
import ChevronRight from './assets/ChevronRight.png';
import Sophia from './assets/Sophia.png';
import Unblock from './assets/UnblockIcon.png';
import AvatarBackground from './assets/Avatar1.png';
import Edit from './assets/EditIcon.png';
import User from './assets/UserIcon.png';
import TFAicon from './assets/TFAicon.png';
import { KeyboardEvent } from 'react';
import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import './Login.css';
import './Dashboard.css';
import './Settings.css';
import './Start.css'


const characters = [
    { name: 'Aurora', image: Aurora, infos: AuroraInfos },
    { name: 'Luna', image: Luna, infos: LunaInfos },
    { name: 'Lumina', image: Lumina, infos: LuminaInfos },
    { name: 'Nova', image: Nova, infos: NovaInfos },
    { name: 'Starlight', image: Starlight, infos: StarlightInfos },
    { name: 'Aegeon', image: Aegeon, infos: AegeonInfos },
  ];


function Settings() {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isCharacterSelected, setIsCharacterSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('JohnDoe');


  const handleLeftChevronClick = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
  };

  const handleRightChevronClick = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
  };

  const handleChangeCharacterClick = () => {
    setIsCharacterSelected(true);
  };
  const handleEditClick = () => {
    setIsEditing(true);
};

const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 10) {
        setEditedUsername(inputValue);
    }
};


const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        setIsEditing(false);
    }
};

const currentCharacter = characters[currentCharacterIndex];

    return(
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
                <div className="Settings">
                    <h1>Settings</h1>
                </div>
                <div className="SettingsBar"> </div>
                <img src={LogoImage} className="LogoImage" alt="LogoImage" />
                <img src={HomeIcon} className="HomeIcon" alt="HomeIcon" />
                <img src={GameIcon} className="GameIcon" alt="GameIcon" />
                <img src={ChatIcon} className="ChatIcon" alt="ChatIcon" />
                <img src={SettingsIcon} className="SettingsIcon" alt="SettingsIcon" />
                <img src={LogoutIcon} className="LogoutIcon" alt="LogoutIcon" />
                <img src={InfosIcon} className="InfosIcon" alt="InfosIcon" />
                <img src={Avatar} className="Avatar" alt="Avatar" />
                <div className="ProfileSet">
                {isEditing ? (
                    <input
                    type="text"
                    value={editedUsername}
                    onChange={handleUsernameChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="EditInput" 
                    />
                    ) : (
                        <p className="Username">{editedUsername}</p>
                        )}
                </div>
                        <img src={User} alt="User Icon" className="UserIcon" />
                <img src={Edit} alt="Edit Icon" className="EditIcon" onClick={handleEditClick} />

                    <div className="AvatarEditCircle">
                        <p className="AvatarEditText">&nbsp; Edit <br /> Avatar</p>
                    </div>
                        <img src={AvatarBackground} className="AvatarBackground" alt="AvatarBackground" />
                    <img src={Avatar2} className="Avatar2" alt="Avatar2" />
                    <img src={Avatar3} className="Avatar3" alt="Avatar3" />
                    <img src={Avatar4} className="Avatar4" alt="Avatar4" />
                    <img src={Avatar5} className="Avatar5" alt="Avatar5" />
                    <img src={Avatar6} className="Avatar6" alt="Avatar6" />
                    <div className="BlockedList"> 
                    <div className="BlockedListTitle">
                        <h1>Blocked List</h1>
                    </div>
                    <div className="BlockedItem">
                        <img src={Sophia} alt="Blocked Avatar" className="BlockedAvatar" />
                        <p className="BlockedName">Sophia</p>
                        <img src={Unblock} alt="Unblock Icon" className="UnblockIcon" />
                    </div>        
                </div>
                <button className="CharacterRectangleSettings" onClick={handleChangeCharacterClick}>
                    <p className="CharacterTextSettings">Change your character</p>
                </button>
                <div className="Name">
                    <p className="CharacterNameSettings">{currentCharacter.name}</p>
                </div>
                <img src={currentCharacter.image} className="CharacterImageSettings" alt={currentCharacter.name} />
                <img
                    src={currentCharacter.infos}
                    className="CharacterInfosSettings"
                    alt={`${currentCharacter.name} Infos`}
                />
                <img
                    src={ChevronLeft}
                    className="ChevronLeftSettings"
                    alt="ChevronLeft"
                    onClick={handleLeftChevronClick}
                />
                <img
                    src={ChevronRight}
                    className="ChevronRightSettings"
                    alt="ChevronRight"
                    onClick={handleRightChevronClick}
                />
                <div className="TFA">
                    <h1>Set the two-factor authentication</h1>
                </div>
                    <img src={TFAicon} alt="TFA Icon" className="TFAIcon" />

                <div className="SaveTheChanges">
                    <button className="SaveTheChangesRectangle">
                        <p className="SaveTheChangesText">Save the changes!</p>
                    </button>
                </div>

            </header>
        </div>
    );

}

export default Settings;