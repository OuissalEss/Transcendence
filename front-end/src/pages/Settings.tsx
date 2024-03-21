import { KeyboardEvent, useEffect } from 'react';
import React, { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../assets/Settings.css';
import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';
import axios from 'axios';

import ImageCompressor from 'image-compressor.js';

import User from './types/user-interface';
import { gql, OperationVariables, ApolloClient } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/react-hooks'


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
// avatar
import Sophia from '/Avatars/02.jpeg';
import Avatar from '/Avatars/01.jpeg';
import Avatar2 from '/Avatars/01.jpeg';
import Avatar3 from '/Avatars/01.jpeg';
import Avatar4 from '/Avatars/01.jpeg';
import Avatar5 from '/Avatars/01.jpeg';
import Avatar6 from '/Avatars/01.jpeg';
import AvatarBackground from '/Avatars/01.jpeg';
import DashboardLayout from '../layouts/LayoutDefault';

//
import LogoImage from '/logo.png';
import HomeIcon from '/Icons/Edit.png';
import GameIcon from '/Icons/Edit.png';
import SettingsIcon from '/Icons/Edit.png';
import LogoutIcon from '/Icons/Edit.png';
import InfosIcon from '/Icons/Edit.png';
import ChatIcon from '/Icons/Edit.png';
import NotificationIcon from '/Icons/Edit.png';
import SearchIcon from '/Icons/Edit.png';

const characters = [
    { name: 'Aurora', image: Aurora, infos: AuroraInfos },
    { name: 'Luna', image: Luna, infos: LunaInfos },
    { name: 'Lumina', image: Lumina, infos: LuminaInfos },
    { name: 'Nova', image: Nova, infos: NovaInfos },
    { name: 'Starlight', image: Starlight, infos: StarlightInfos },
    { name: 'Aegon', image: Aegon, infos: AegonInfos },
];

// import { Cloudinary } from 'cloudinary-core';
// const cloudinary = new Cloudinary({
//     cloud_name: 'dupbnyzw7',
//     api_key: '984415362569689',
//     api_secret: 'IqKyztO9et4W6mAigZvuGWw9i24'
// });

import { Cloudinary } from "@cloudinary/url-gen";

const getProfile = () => {
    const [userData, setUserData] = useState<User>();
    // const [isLoading, setLoading] = useState(true);

    const USER_DATA = gql`
    query {
    getUserInfo {
            id
            email
            username
            character
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


const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


};



function Settings() {
    const navigate = useNavigate();
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [characterChanged, setCharacterChanged] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [avatarImage, setAvatarImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [uploadUrl, setUploadUrl] = useState("");

    const [updateUserName] = useMutation(UPDATE_USER_NAME);
    const [updateUserCharracter] = useMutation(UPDATE_USER_CHARACTER);
    const [updateUserAvatar] = useMutation(UPDATE_USER_AVATAR);

    const userData = getProfile();
    if (!userData) return '';
    const userAvatar = userData.avatar.filename;
    const index = characters.findIndex(character => character.name === userData.character);

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
        const file = event.target.files[0];
        setSelectedFile(event.target.files[0]);
        console.log("-------------- ", file)
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
        console.log("BEFORE");
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
            console.log("++++++++++++++++++++");
            console.log("res = ", res.public_id);
            console.log("++++++++++++++++++++");
            return (cld.image(res.public_id).toURL());
        } catch (error) {
            console.log("ERROR");
            return '';
        }
    };

    async function handleSaveButtonClick() {
        setLoading(true);
        if (isEditing && editedUsername.trim() === '') {
            alert('You should set a username');
            return;
        }
        if (editedUsername) {
            updateUserName({ variables: { user_name: editedUsername } })
                .then(response => {
                    console.log(response);
                    navigate('/');
                })
                .catch(error => { console.error(error); });
        }
        if (characterChanged) {
            updateUserCharracter({ variables: { char_name: currentCharacter.name } })
                .then(response => {
                    console.log(response);
                    navigate('/');
                })
                .catch(error => { console.error(error); });
        }
        if (avatarImage) {
            const Url = await uploadAvatar();
            console.log("********URL = ", Url);
            updateUserAvatar({ variables: { avatar_name: Url } })
                .then(response => {
                    console.log(response);
                    navigate('/');
                })
                .catch(error => { console.error(error); });
        }
    };

    return (
        <DashboardLayout>
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
                    <div className="Profile">
                        {isEditing ? (
                            <input type="text" value={editedUsername}
                                onChange={handleUsernameChange}
                                autoFocus className="EditInput" />
                        ) : (
                            <input type="text" value={userData.username}
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
                        <div className="BlockedItem">
                            <img src={Sophia} alt="Blocked Avatar" className="BlockedAvatar" />
                            <p className="BlockedName">Sophia</p>
                            <img src={Unblock} alt="Unblock Icon" className="UnblockIcon" />
                        </div>
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
                    <div className="TFA">
                        <h1>Set the two-factor authentication</h1>
                    </div>
                    <img src={TFAicon} alt="TFA Icon" className="TFAIcon" />

                    <div className="SaveTheChanges">
                        <button className="SaveTheChangesRectangle" onClick={handleSaveButtonClick}>
                            {loading ? (
                                <div className="Processing">
                                    <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-6 w-6"></div>
                                </div>
                            ) : (<span></span>)}
                            <p className="SaveTheChangesText">Save the changes!</p>
                        </button>
                    </div>

                </header>
            </div>
        </DashboardLayout>
    );
}

export default Settings;
