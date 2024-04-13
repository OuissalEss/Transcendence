import { ChangeEvent } from "react";
import { Socket } from "socket.io-client";

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
	updateChannel: (channel: channelType) => Promise<void>;  
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
	members: {
		id: string;
		name: string;
		icon: string;
		status: string;
	}[];
	admins: {
		id: string;
		name: string;
		icon: string;
	}[];
	owner: {
		id: string;
		name: string;
		icon: string;
	};
	updateChannel: (channel: channelType) => Promise<void>;  

};

export type channel = {
	id: string,
	title: string,
	description: string,
	type: string,
	password: string | null,
	profileImage: string,
	updatedAt: Date,
	owner: {
	  id: string,
	  username: string,
	  avatar:{filename: string}
	},
	admins: {
	  id: string,
	  username: string,
	  avatar:{filename: string}
	}[],
	members: {
	  id: string,
	  username: string,
	  avatar:{filename: string},
	  status: string,
	  blocked: {
		blockedUserId: string;
	  }[]
	  blocking: {
		blockerId: string;
	  }[]
	}[],
	banned: {
	  id: string,
	  username: string,
	  avatar:{filename: string} }[],
	muted: {
	  id: string,
	  username: string,
	  avatar:{filename: string} }[],
	messages: {
	  id: string,
	  text: string,
	  time: Date,
	  sender: string,
	  senderId: string,
	  read: boolean,
	}[] 
}

export type channelType = {
	id: string,
	title: string,
	description: string,
	type: string,
	password: string | null,
	icon: string,
	updatedAt: Date,
	owner: {
	  id: string,
	  name: string,
	  icon: string
	},
	admins: {
	  id: string,
	  name: string,
	  icon: string
	}[],
	members: {
	  id: string,
	  name: string,
	  icon: string,
	  status: string,
	  blocked: string[];
	  blocken: string[];
	}[],
	banned: {
	  id: string,
	  name: string,
	  icon: string
	}[],
	muted: {
	  id: string,
	  name: string,
	  icon: string
	}[],
	messages: {
	  id: string,
	  text: string,
	  sender: string,
	  senderId: string,
	  time: Date,
	  read: boolean,
	}[]
  };