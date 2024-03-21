import './assets/Start.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

import LogoImage from '/logo.png';
import Avatar1 from '/Avatars/06.png';
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
import { gql, OperationVariables, ApolloClient } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks'

const characters = [
  { name: 'Aurora', image: Aurora, infos: AuroraInfos },
  { name: 'Luna', image: Luna, infos: LunaInfos },
  { name: 'Lumina', image: Lumina, infos: LuminaInfos },
  { name: 'Nova', image: Nova, infos: NovaInfos },
  { name: 'Starlight', image: Starlight, infos: StarlightInfos },
  { name: 'Aegon', image: Aegon, infos: AegonInfos },
];

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
  console.log("var = ", resutls)

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

  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [username, setUsername] = useState("");
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [isCharacterSelected, setIsCharacterSelected] = useState(false);
  const navigate = useNavigate();
  const currentCharacter = characters[currentCharacterIndex];

  const userData = getProfile();
  const [updateUser] = useMutation(UPDATE_USER);

  if (!userData) return <p>No profile data</p>


  const handleSetUsernameClick = () => {
    setShowUsernameInput(true);
    setUsername(userData.username);
  };

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  function handleStartButtonClick() {
    if (username && isCharacterSelected) {
      console.log(username);
      updateUser({ variables: { user_name: username, char_name: currentCharacter.name } })
        .then(response => {
          console.log(response);
          navigate('/');
        })
        .catch(error => {
          console.error(error);
        });
    }
    else {
      alert('you should set a username and select a character');
    }
  };

  console.log("character == ", currentCharacter.name)

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
          <p className="CharacterText">Click to choose your character</p>
        </button>
        <div className="Texto">
          <p className="Line">Welcome, Champion!</p>
        </div>
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img src={userData.avatar.filename} className="Avatar1" alt="Avatar1" />
        <div className="Name">
          <p className="CharacterName">{currentCharacter.name}</p>
        </div>
        <img src={currentCharacter.image} className={`CharacterImage ${isCharacterSelected ? 'Selected' : ''}`} alt={currentCharacter.name} />
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