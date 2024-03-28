import { useEffect } from 'react';
import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../assets/Settings.css';
import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';

import ImageCompressor from 'image-compressor.js';

import User from '../types/user-interface';
import { useQuery, gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks'

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
// Icons
import ChevronLeft from '/Icons/ChevronLeft.png';
import ChevronRight from '/Icons/ChevronRight.png';
import Edit from '/Icons/Edit.png';
import UserIcon from '/Icons/User.png';
import TFAicon from '/Icons/TFA.png';
import Unblock from '/Icons/Unblock.png';


const characters = [
    { name: 'Aurora', image: Aurora, infos: AuroraInfos },
    { name: 'Luna', image: Luna, infos: LunaInfos },
    { name: 'Lumina', image: Lumina, infos: LuminaInfos },
    { name: 'Nova', image: Nova, infos: NovaInfos },
    { name: 'Starlight', image: Starlight, infos: StarlightInfos },
    { name: 'Aegon', image: Aegon, infos: AegonInfos },
];

import { Cloudinary } from "@cloudinary/url-gen";
import Alert from '../components/Alert';
import TwoFactorAuthActivation from '../components/TwoFactorAuthActivation';
import { useSocket } from '../App';
import Block from '../types/block-interface';

const USER_BLOCKED = gql`
    query {
        getUserBlocked{
            id
            blockedUser{
                id
                username
                avatar {
                    filename
                }
            }
        }
    }
`;

const UPDATE_USER_NAME = gql`
mutation($user_name: String!) { 
    updateUsername(username: $user_name) {
        id
        username
    }
}
`;

const UPDATE_USER_CHARACTER = gql`
    mutation($char_name: String!) { 
        updateUserCharacter(character: $char_name) {
            id
            username
        }
    }
`;

const UPDATE_USER_AVATAR = gql`
    mutation($avatar_name: String!) { 
        updateUserAvatar(newAvatar: $avatar_name) {
            id
            username
        }
    }
`;

const UPDATE_USER_BLOCK = gql`
    mutation($block_id: String!) {
        unBlock (blockId: $block_id){
            id
        }
    }
`;

const UPDATE_TFA = gql`
    mutation { 
        desactivate2Fa{
            id
        }
    }
`;

function Settings() {
    const [alertMessage, setAlertMessage] = useState('');
    const [isShowAlert, setIsShowAlert] = useState(false);
    const [isShowTFA, setIsShowTFA] = useState(false);

    const navigate = useNavigate();
    const [characterChanged, setCharacterChanged] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | ArrayBuffer | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading1, setLoading1] = useState(false);

    const [uploadUrl, setUploadUrl] = useState("");

    const [updateUserName] = useMutation(UPDATE_USER_NAME);
    const [updateUserCharacter] = useMutation(UPDATE_USER_CHARACTER);
    const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR);
    const [unblockUser] = useMutation(UPDATE_USER_BLOCK);

    const [desactivate2Fa] = useMutation(UPDATE_TFA);

    const [blocked, setBlocked] = useState<Block[]>();

    const { userData } = useSocket();

    useEffect(() => {
        if ( !userData) return;

        // setBlocked2(blocked);
    }, [ userData]);


  const { data, loading, error } = useQuery(USER_BLOCKED, { variables: { } });

  useEffect(() => {
    try {
      if (error) {
        throw new Error('Failed to fetch user data');
      }
      if (data) {
        setBlocked(data.getUserBlocked);
      }
    } catch (error) {
      console.error(error);
    }
  }, [data, loading, error]);

    console.log("Blocked = ", blocked);
    const blockedList = blocked?.map((b: Block) => ({
        b_id: b.id,
        id: b.blockedUser.id,
        username: b.blockedUser.username,
        image: b.blockedUser.avatar ? b.blockedUser.avatar.filename : ''
    }));

    const userAvatar = userData?.avatar?.filename;
    const index = characters.findIndex(character => character.name === userData?.character);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(index);
    
    const handleLeftChevronClick = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
        setCharacterChanged(true);
    };

    const handleRightChevronClick = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
        setCharacterChanged(true);
    };

    const handleChangeCharacterClick = () => {
        setCharacterChanged(true);
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue.length <= 10) {
            setEditedUsername(inputValue);
        }
        setIsEditing(true);
    };

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const currentCharacter = characters[currentCharacterIndex];
    const myCharacter = characters[index];


    // Create and configure your Cloudinary instance.
    const cld = new Cloudinary({
        cloud: {
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }
    });

    const uploadAvatar = async () => {
        const imageCompressor = new ImageCompressor(); // Instantiate ImageCompressor
        const compressedFile = await imageCompressor.compress(selectedFile, { // Use compress method
            maxWidth: 150,
            maxHeight: 150,
            quality: 0.5, // Adjust quality as needed
        });
        const data = new FormData();
        data.append("file", compressedFile);
        data.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        data.append("folder", "Cloudinary-React");


        // Specify the image quality here (between 0 to 100)
        // data.append("quality", '10');
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: data,
                }
            );
            const res = await response.json();
            setUploadUrl(res.public_id);
            return (cld.image(res.public_id).toURL());
        } catch (error) {
            console.log("ERROR");
            return '';
        }
    };

    const showAlert = (message: string) => {
        setAlertMessage(message);
        setIsShowAlert(true);
    };

    const closeAlert = () => {
        setIsShowAlert(false);
    };

    const showTFA = () => {
        setIsShowTFA(true);
    };

    const closeTFA = () => {
        setIsShowTFA(false);
    };

    const handleDesactivate = async () => {
        try {
            await desactivate2Fa({ variables: { } });
            console.log("2fa updated successfully!");
        } catch (error) {
            console.error("Error updating Username:", error.message);
        }
        alert('2FA desactivated successful');
        window.location.reload();
    };

    async function handleSaveButtonClick() {
        setLoading1(true);
        if (isEditing && editedUsername.trim() === '') {
            showAlert('Set your username');
            setLoading1(false);
            return;
        }
        else {
            if (characterChanged) {
                try {
                    await updateUserCharacter({ variables: { char_name: currentCharacter.name } });
                    console.log("Character updated successfully!");
                  } catch (error) {
                    console.error("Error updating character:", error.message);
                  }
            }
            if (avatarImage) {
                const Url = await uploadAvatar();
                try {
                    await updateUserAvatar({ variables: { avatar_name: Url } });
                    console.log("Avatar updated successfully!");
                  } catch (error) {
                    console.error("Error updating Avatar:", error.message);
                  }
                
            }
            if (editedUsername) {
                try {
                    await updateUserName({ variables: { user_name: editedUsername } });
                    console.log("Username updated successfully!");
                  } catch (error) {
                    console.error("Error updating Username:", error.message);
                  }
            }
            window.location.reload();
        }
    };
    async function handleUnblock(id: string) {
        try {
            await unblockUser({ variables: { block_id: id } });
            console.log("Username updated successfully!");
        } catch (error) {
             console.error("Error updating Username:", error.message);
        }
        window.location.reload();
    }
    return (
        <div className="Login">
            <header className="Login-header">
                <div className="SearchBarS">
                    <SearchBar />
                </div>
                <div className="NotificationBarS">
                    <Notifications />
                </div>
                <div className="Settings">
                    <h1>Settings</h1>
                </div>
                <div className="SettingsBar"> </div>
                <div className="ProfileS">
                    {isEditing ? (
                        <input type="text" value={editedUsername}
                            onChange={handleUsernameChange}
                            autoFocus className="EditInput" />
                    ) : (
                        <input type="text" value={userData?.username}
                            onChange={handleUsernameChange}
                            autoFocus className="EditInput" />
                    )}

                    <img src={UserIcon} alt="User Icon" className="UserIcon" />
                    <img src={Edit} alt="Edit Icon" className="EditIcon" />
                </div>

                <div className="AvatarEditCircle" >
                    <label htmlFor="avatarInput" className="AvatarEditText">
                        &nbsp; Edit <br /> Avatar
                    </label>
                    <input
                        type="file"
                        id="avatarInput"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </div>
                {avatarImage ? (
                    <img src={avatarImage} className="AvatarBackground" alt="Avatar" />
                ) : (
                    <img src={userAvatar} className="AvatarBackground" alt="AvatarBackground" />
                )}
                <div className="BlockedList">
                    <div className="BlockedListTitle">
                        <h1>Blocked List</h1>
                    </div>
                    <ul>
                        {blockedList?.map((b, index) => {
                            return (
                                <li key={index} className="BlockedItem">
                                    <img src={b.image} alt="Blocked Avatar" className="BlockedAvatar" />
                                    <p className="BlockedName">{b.username}</p>
                                    <img src={Unblock} alt="Unblock Icon" className="UnblockIcon" onClick={() => handleUnblock(b.b_id)} />
                                </li>
                            );
                        })}
                    </ul>

                </div>
                <button className="CharacterRectangleSettings" onClick={handleChangeCharacterClick}>
                    <p className="CharacterTextSettings">Change your character</p>
                </button>



                {characterChanged ? (
                    <div>
                        <div className="NameS">
                            <p className="CharacterNameSettings">{currentCharacter.name}</p>
                        </div>
                        <img src={currentCharacter.image} className="CharacterImageSettings" alt={currentCharacter.name} />
                        <img
                            src={currentCharacter.infos}
                            className="CharacterInfosSettings"
                            alt={`${currentCharacter.name} Infos`}
                        />
                    </div>
                ) : (
                    <div>
                        <div className="NameS">
                            <p className="CharacterNameSettings">{myCharacter.name}</p>
                        </div>
                        <img src={myCharacter.image} className="CharacterImageSettings" alt={myCharacter.name} />
                        <img
                            src={myCharacter.infos}
                            className="CharacterInfosSettings"
                            alt={`${myCharacter.name} Infos`}
                        />
                    </div>
                )}


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

                {!userData.connection.is2faEnabled ?(
                    <div className="TFA" onClick={showTFA}>
                        <img src={TFAicon} alt="TFA Icon" className="TFAIcon" /><h1>Activate Two-factor authentication</h1>
                    </div>
                ) : (
                    <div className="TFA" onClick={handleDesactivate}>
                        <img src={TFAicon} alt="TFA Icon" className="TFAIcon" /><h1>Desactivate Two-factor authentication</h1>
                    </div>
                )}

                <div className="SaveTheChanges">
                    <button className="SaveTheChangesRectangle" onClick={handleSaveButtonClick}>
                        {loading1 ? (
                            <div className="Processing">
                                <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-6 w-6"></div>
                            </div>
                        ) : (<span></span>)}
                        <p className="SaveTheChangesText">Save the changes!</p>
                    </button>
                </div>

            </header>
            {isShowAlert &&
                <div className="alertContainer">
                    <Alert message={alertMessage} onClose={closeAlert} />
                </div>
            }
            {isShowTFA &&
                <div className="tfaContaine">
                    <TwoFactorAuthActivation onClose={closeTFA} />
                </div>
            }
        </div>
    );
}

export default Settings;
