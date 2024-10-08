import { useEffect } from 'react';
import { ChangeEvent } from 'react';
import { useState } from 'react';
import '../assets/Settings.css';
import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';

import ImageCompressor from 'image-compressor.js';

import User from '../types/user-interface';
import { gql } from "@apollo/client";
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

import { Cloudinary } from "@cloudinary/url-gen/index";
import Alert from '../components/Alert';
import TwoFactorAuthActivation from '../components/TwoFactorAuthActivation';
import Block from '../types/block-interface';
import { useAuth } from '../provider/authProvider';
import Loading from '../components/Loading';
import { Socket, io } from 'socket.io-client';

const USER_DATA_QUERY = `
    query UserData {
        getUserInfo {
            id
            email
            username
            xp
            character
            connection {
                provider
                is2faEnabled
            }
            avatar {
              filename
            }
            achievements{
                achievement
                createdAt
            }
            blocking {id}
            winner{id}
            loser{id}
            host{id}
            guest{id}
            createdAt
        }
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
    const { token } = useAuth();

    const [characterChanged, setCharacterChanged] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | null>(null);
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
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User>();
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        if (!token) return; // If token is not available, do nothing

        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                query: USER_DATA_QUERY
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then(({ data }) => {
                if (data) {
                    setLoading(false);
                    setUserData(data.getUserInfo);
                    setBlocked(data.getUserBlocked);
                    setEditedUsername(data.getUserInfo?.username);
                }
            })
            .catch(error => {
                setLoading(false);
                console.error('Error fetching friends:', error);
            });
    }, []);

    useEffect(() => {
        const newSocket = io('ws://localhost:3003/chat');
        setSocket(newSocket);
        uploadUrl;
        return () => {
            newSocket.disconnect();
        };
    }, [setSocket]);

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

    // const handleChangeCharacterClick = () => {
    //     setCharacterChanged(true);
    // };

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
            if (typeof reader.result === 'string') {
                setAvatarImage(reader.result);
            }
        };
        if (file)
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
        if (selectedFile) {
            const compressedFile = await imageCompressor.compress(selectedFile, { // Use compress method
                maxWidth: 500,
                maxHeight: 500,
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
                return '';
            }
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

    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            setIsEditing(false);
        }
    };

    const handleDesactivate = async () => {
        try {
            await desactivate2Fa({ variables: {} });
            console.log("2fa updated successfully!");
        } catch (error: any) {
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
                } catch (error: any) {
                    console.error("Error updating character:", error.message);
                }
            }
            if (avatarImage) {
                const Url = await uploadAvatar();
                try {
                    await updateUserAvatar({ variables: { avatar_name: Url } });
                    console.log("Avatar updated successfully!");
                } catch (error: any) {
                    console.error("Error updating Avatar:", error.message);
                }

            }
            if (editedUsername) {
                try {
                    await updateUserName({ variables: { user_name: editedUsername } });
                    console.log("Username updated successfully!");
                } catch (error: any) {
                    console.error("Error updating Username:", error.message);
                }
            }
            window.location.reload();
        }
    };
    async function handleUnblock(id: string, userId: string) {
        try {
            await unblockUser({ variables: { block_id: id } });
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            socket?.emit("unblockUser", { blockerId: user.id, blockedUserId: userId });
            console.log("Username updated successfully!");
        } catch (error: any) {
            console.error("Error updating Username:", error.message);
        }
        window.location.reload();
    }

    if (isLoading)
        return <Loading />
    return (
        <div className="SettingsPage ml-[90px] mt-[20px]">
            <div className="grid grid-cols-3 header_settings ml-[40px] mr-[70px]">
                <div className='col-span-1 Settings mt-[10px]'>
                    <h1>Settings</h1>
                </div>

                <div className='col-span-1 text-while'>
                    <SearchBar />
                </div>

                <div className='col-span-1'>
                    <Notifications />
                </div>
            </div>
            <div className='SettingsRep mt-[100px] grid grid-cols-3'>
                <div className="SettingsBar  col-span-2">
                    <div className="ProfileS">
                        {isEditing ? (
                            <input type="text" value={editedUsername}
                                onChange={handleUsernameChange}
                                onKeyDown={handleKeyDown}
                                autoFocus className="EditInput" />
                        ) : (
                            <p className="Username">{editedUsername}</p>

                        )}

                        <img src={UserIcon} alt="User Icon" className="UserIcon" referrerPolicy="no-referrer" />
                        <img src={Edit} alt="Edit Icon" className="EditIcon" onClick={handleEditClick} referrerPolicy="no-referrer" />
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
                        <img src={avatarImage} className="AvatarBackground" alt="Avatar" referrerPolicy="no-referrer" />
                    ) : (
                        <img src={userAvatar} className="AvatarBackground" alt="AvatarBackground" referrerPolicy="no-referrer" />
                    )} <div className="CharacterRectangleSettings">
                        <p className="CharacterTextSettings">Change your character</p>
                    </div>



                    {characterChanged ? (
                        <div>
                            <div className="NameS">
                                <p className="CharacterNameSettings">{currentCharacter.name}</p>
                            </div>
                            <img src={currentCharacter.image} className="CharacterImageSettings" alt={currentCharacter.name} referrerPolicy="no-referrer" />
                            <img
                                src={currentCharacter.infos}
                                className="CharacterInfosSettings"
                                alt={`${currentCharacter.name} Infos`}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    ) : (
                        <div>
                            <div className="NameS">
                                <p className="CharacterNameSettings">{myCharacter.name}</p>
                            </div>
                            <img src={myCharacter.image} className="CharacterImageSettings" alt={myCharacter.name} referrerPolicy="no-referrer" />
                            <img
                                src={myCharacter.infos}
                                className="CharacterInfosSettings"
                                alt={`${myCharacter.name} Infos`}
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    )}


                    <img
                        src={ChevronLeft}
                        className="ChevronLeftSettings"
                        alt="ChevronLeft"
                        onClick={handleLeftChevronClick}
                        referrerPolicy="no-referrer"
                    />
                    <img
                        src={ChevronRight}
                        className="ChevronRightSettings"
                        alt="ChevronRight"
                        onClick={handleRightChevronClick}
                        referrerPolicy="no-referrer"
                    />

                    {!userData?.connection.is2faEnabled ? (
                        <div className="TFA" onClick={showTFA}>
                            <img src={TFAicon} alt="TFA Icon" className="TFAIcon" referrerPolicy="no-referrer" /><h1>Activate Two-factor authentication</h1>
                        </div>
                    ) : (
                        <div className="TFA" onClick={handleDesactivate}>
                            <img src={TFAicon} alt="TFA Icon" className="TFAIcon" referrerPolicy="no-referrer" /><h1>Desactivate Two-factor authentication</h1>
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
                </div>
                <div className="BlockedList col-span-1 ">
                    <div className="BlockedListTitle">
                        <h1>Blocked List</h1>
                    </div>
                    <ul>
                        {blockedList?.map((b, index) => {
                            return (
                                <li key={index} className="BlockedItem">
                                    <img src={b.image} alt="Blocked Avatar" className="BlockedAvatar" referrerPolicy="no-referrer" />
                                    <p className="BlockedName">{b.username}</p>
                                    <img src={Unblock} alt="Unblock Icon" className="UnblockIcon" onClick={() => handleUnblock(b.b_id, b.id)} referrerPolicy="no-referrer" />
                                </li>
                            );
                        })}
                    </ul>

                </div>

            </div>
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