import './Start.css';
import { useState } from 'react';
import LogoImage from './assets/Logo.png';
import Avatar1 from './assets/Avatar1.png';
import Aurora from './assets/Aurora.png';
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
import AuroraInfos from './assets/AuroraInfos.png';
import ChevronLeft from './assets/ChevronLeft.png';
import ChevronRight from './assets/ChevronRight.png';
import { useNavigate } from 'react-router-dom';

const characters = [
  { name: 'Aurora', image: Aurora, infos: AuroraInfos },
  { name: 'Luna', image: Luna, infos: LunaInfos },
  { name: 'Lumina', image: Lumina, infos: LuminaInfos },
  { name: 'Nova', image: Nova, infos: NovaInfos },
  { name: 'Starlight', image: Starlight, infos: StarlightInfos },
  { name: 'Aegeon', image: Aegeon, infos: AegeonInfos },
];

function Start() {
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState('');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isCharacterSelected, setIsCharacterSelected] = useState(false);
  const navigate = useNavigate();

  const handleSetUsernameClick = () => {
    setShowUsernameInput(true);
  };

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 10) {
      setUsername(inputValue);
    }
  };
  
  
  const handleUsernameInputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setShowUsernameInput(false);
    }
  };
  

  const handleLeftChevronClick = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
  };

  const handleRightChevronClick = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
  };

  const currentCharacter = characters[currentCharacterIndex];

  const handleChooseCharacterClick = () => {
    setIsCharacterSelected(true);
  };

  const handleStartButtonClick = () => {
    if (username && isCharacterSelected) {
      navigate('/pprofile');
    }
  };
  

  return (
    <div className="Start">
      <header className="Start-header">
        <div className="BlurryRectangle"></div>
        {showUsernameInput ? (
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameInputChange}
            onKeyPress={handleUsernameInputEnter}
            className="UsernameInput"
          />
        ) : (
          <button className="UsernameRectangle" onClick={handleSetUsernameClick}>
            <p className="UsernameText">{username || 'Set username'}</p>
          </button>
        )}
        <button
          className={`StartRectangle ${(!username || !isCharacterSelected) && 'Disabled'}`}
          onClick={handleStartButtonClick}
        >
          <p className="StartText">Let's go!</p>
        </button>
        <button className="CharacterRectangle" onClick={handleChooseCharacterClick}>
          <p className="CharacterText">Choose your character</p>
        </button>
        <img
          src={currentCharacter.image}
          className={`CharacterImage ${isCharacterSelected ? 'Selected' : ''}`}
          alt={currentCharacter.name}
        />
        <div className="Texto">
          <p className="Line">Welcome, Champion!</p>
        </div>
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img src={Avatar1} className="Avatar1" alt="Avatar1" />
        <div className="Name">
          <p className="CharacterName">{currentCharacter.name}</p>
        </div>
        <img src={currentCharacter.image} className="CharacterImage" alt={currentCharacter.name} />
        <img
          src={currentCharacter.infos}
          className="CharacterInfos"
          alt={`${currentCharacter.name} Infos`}
        />
        <img
          src={ChevronLeft}
          className="ChevronLeft"
          alt="ChevronLeft"
          onClick={handleLeftChevronClick}
        />
        <img
          src={ChevronRight}
          className="ChevronRight"
          alt="ChevronRight"
          onClick={handleRightChevronClick}
        />
      </header>
    </div>
  );
}

export default Start;
