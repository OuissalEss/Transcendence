import './assets/Start.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import LogoImage from '/logo.png';
import ChevronLeft from '/Icons/ChevronLeft.png';
import ChevronRight from '/Icons/ChevronRight.png';
// Characters
import Aurora from '/Characters/Aurora/01.png';
import Luna from '/Characters/Luna/02.png';
import Lumina from '/Characters/Lumina/01.png';
import Nova from '/Characters/Nova/01.png';
import Starlight from '/Characters/Starlight/01.png';
import Aegon from '/Characters/Aegon/01.png';
// Characters Info
import AuroraInfos from '/Characters/Aurora/Infos.png';
import LunaInfos from '/Characters/Luna/Infos.png';
import LuminaInfos from '/Characters/Lumina/Infos.png';
import NovaInfos from '/Characters/Nova/Infos.png';
import StarlightInfos from '/Characters/Starlight/Infos.png';
import AegonInfos from '/Characters/Aegon/Infos.png';

import User from './types/user-interface';
import { gql } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks'
import Alert from './components/Alert';

const characters = [
  { name: 'Aurora', image: Aurora, infos: AuroraInfos },
  { name: 'Luna', image: Luna, infos: LunaInfos },
  { name: 'Lumina', image: Lumina, infos: LuminaInfos },
  { name: 'Nova', image: Nova, infos: NovaInfos },
  { name: 'Starlight', image: Starlight, infos: StarlightInfos },
  { name: 'Aegon', image: Aegon, infos: AegonInfos },
];

import Cookies from "js-cookie";
import { useAuth } from './provider/authProvider';


const getProfile = () => {
  const [userData, setUserData] = useState<User>();
  // const [isLoading, setLoading] = useState(true);

  const USER_DATA = gql`
  query {
  getUserInfo {
          id
          email
          username
          connection {
              provider
              is2faEnabled
          }
          avatar {
            filename
          }
      }
    }
  `;


  const resutls = useQuery(USER_DATA);

  useEffect(() => {
    try {

      const { data, error } = resutls;

      if (error) {
        throw new Error('Failed to fetch user data');
      }
      if (data) {
        setUserData(data.getUserInfo);
      }
    } catch (error) {
      console.error(error);
    }

  }, [resutls]);

  if (!userData) return '';

  return userData;
}

const UPDATE_USER = gql`
mutation($user_name: String!, $char_name: String!) { 
  updateUsername(username: $user_name) {
    id
    username
  }
  updateUserCharacter(character: $char_name) {
    id
    username
  }
}
`;

function Start() {
  const [alertMessage, setAlertMessage] = useState('');
  const [isShowAlert, setIsShowAlert] = useState(false);

  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState("");
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isCharacterSelected, setIsCharacterSelected] = useState(false);
  const navigate = useNavigate();
  const currentCharacter = characters[currentCharacterIndex];
  const { token } = useAuth();
  const userData = getProfile();
  const [updateUser] = useMutation(UPDATE_USER);

  if (!userData) return <p>No profile data</p>


  const handleSetUsernameClick = () => {
    setShowUsernameInput(true);
    setUsername(userData.username);
  };

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 11)
      setUsername(event.target.value);
  };

  const handleUsernameInputEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setShowUsernameInput(false);
    }
  };


  const handleLeftChevronClick = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
    setIsCharacterSelected(false);

  };

  const handleRightChevronClick = () => {
    setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
    setIsCharacterSelected(false);
  };


  const handleChooseCharacterClick = () => {
    setIsCharacterSelected(true);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsShowAlert(true);
  };
  const closeAlert = () => {
    setIsShowAlert(false);
  };

  function handleStartButtonClick() {
    if (username && username.trim() != '' && isCharacterSelected) {
      updateUser({ variables: { user_name: username, char_name: currentCharacter.name } })
        .then(async (response) => {

          const res = await fetch('http://localhost:3000/validateLogin', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const { accessToken } = await res.json();
            Cookies.set('token', accessToken.access_token)
            // Reload the page upon successful verification
            window.location.reload();
          } else {
            showAlert('Select your character');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    else {
      if (username && username.trim() != '')
        showAlert('Select your character');
      else {
        if (isCharacterSelected)
          showAlert('Set your username');
        else
          showAlert('Set your username and Select your character');
      }
    }
  };

  return (
    <div className="Start">
        <img src={LogoImage} className="LogoImageStart" alt="LogoImage" />
      <header className="Start-header mt-[50px]">
        <div className="Texto">
          <p className="Line">Welcome, Champion!</p>
        </div>
        <div className="BlurryRectangle">
          {showUsernameInput ? (
            <input type="text" placeholder="Enter your username" value={username}
              onChange={handleUsernameInputChange} onKeyPress={handleUsernameInputEnter} className="UsernameInput" />
          ) : (
            <button className="UsernameRectangle" onClick={handleSetUsernameClick}>
              <p className="UsernameText">{username || 'Set username'}</p>
            </button>
          )}
          <button className={`StartRectangle ${(!username || !isCharacterSelected) && 'Disabled'}`} onClick={handleStartButtonClick} >
            <p className="StartText">Let's go!</p>
          </button>
          <button className="CharacterRectangle" onClick={handleChooseCharacterClick}>
            <p className="CharacterText">Click to choose your character</p>
          </button>

          <img src={userData.avatar.filename} className="AvatarStart" alt="Avatar" />
          <div className="NameStart">
            <p className="CharacterNameStart">{currentCharacter.name}</p>
          </div>

          <img src={currentCharacter.image} className={`CharacterImageStart ${isCharacterSelected ? 'Selected' : ''}`} alt={currentCharacter.name} />
          <img src={currentCharacter.infos} className="CharacterInfosStart" alt={`${currentCharacter.name} Infos`} />
          <img src={ChevronLeft} className="ChevronLeftStart" alt="ChevronLeftStart" onClick={handleLeftChevronClick} />
          <img src={ChevronRight} className="ChevronRightStart" alt="ChevronRightStart" onClick={handleRightChevronClick} />
        </div>
      </header>
      {isShowAlert &&
        <div className="alertContainer">
          <Alert message={alertMessage} onClose={closeAlert} />
        </div>
      }
    </div>
  );
}

export default Start;