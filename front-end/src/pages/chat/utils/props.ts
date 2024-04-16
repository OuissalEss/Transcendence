import { ChangeEvent } from "react";
import { Socket } from "socket.io-client";
import { admins, channelType, members, owner } from "./types";

export interface AvatarSelectionProps {
    currentCharacterIndex: number;
    handleLeftChevronClick: () => void;
    handleRightChevronClick: () => void;
    avatarList: string[];
}

export interface FormInputProps {
    username: string;
    avatar: string;
    email: string;
    isFormValid: boolean;
    handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface chatProps {
	id : string;
	channels: channelType[];
	setChannels: React.Dispatch<React.SetStateAction<channelType[]>>;
	setDisplay: React.Dispatch<React.SetStateAction<string>>;
	setId: React.Dispatch<React.SetStateAction<string>>;
}

export interface FormInputProps {
    username: string;
    avatar: string;
    email: string;
    isFormValid: boolean;
    handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface DiscussionsProps {
	setDisplay: React.Dispatch<React.SetStateAction<string>>;
	setId: React.Dispatch<React.SetStateAction<string>>;
	channels: channelType[];
	setChannels: React.Dispatch<React.SetStateAction<channelType[]>>;
}

export interface joinRoomProps {
	channels: channelType[];
	setChannels: React.Dispatch<React.SetStateAction<channelType[]>>;
	setDisplay: React.Dispatch<React.SetStateAction<string>>;
	setId: React.Dispatch<React.SetStateAction<string>>;
}

export interface NewRoomProps {
	channel: channelType;
	setDisplay: React.Dispatch<React.SetStateAction<string>>;
	setChannels: React.Dispatch<React.SetStateAction<channelType[]>>;
}

export interface PasswordSettingsProps {
	channel: channelType;
	showPasswordContainer: boolean;
	setShowPasswordContainer: React.Dispatch<React.SetStateAction<boolean>>;
	ChangePwd: boolean;
	setChangePwd: React.Dispatch<React.SetStateAction<boolean>>;
	addPassword: boolean;
	setAddPassword: React.Dispatch<React.SetStateAction<boolean>>;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
	passwordMismatch: boolean;
	setPasswordMismatch: React.Dispatch<React.SetStateAction<boolean>>;
	password: string;
	updateChannel: (channel: channelType, socket: Socket | undefined) => Promise<void>;
	socket?: Socket | undefined;
};

export interface ChannelSettingsProps {
	channel: channelType;
	title: string;
	setTitle: React.Dispatch<React.SetStateAction<string>>;
	description: string;
	setDescription: React.Dispatch<React.SetStateAction<string>>;
	editTitle: boolean;
	setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
	editDescription: boolean;
	setEditDescription: React.Dispatch<React.SetStateAction<boolean>>;
	setAddPassword: React.Dispatch<React.SetStateAction<boolean>>;
	setShowPasswordContainer: React.Dispatch<React.SetStateAction<boolean>>;
	setLock: React.Dispatch<React.SetStateAction<boolean>>;
	lock: boolean;
	setChangePwd: React.Dispatch<React.SetStateAction<boolean>>;
	setNextPage: React.Dispatch<React.SetStateAction<boolean>>;
	socket?: Socket | undefined;
	members: members;
	admins: admins;
	owner: owner;
	updateChannel: (channel: channelType, socket: Socket | undefined) => Promise<void>;  

};
