export type owner = {
    id: string,
    name: string,
    icon: string
}

export type admins = {
    id: string,
    name: string,
    icon: string
}[]

export type members = {
    id: string,
    name: string,
    icon: string,
    status: string,
    xp: number,
    blocked: string[];
    blocken: string[];
}[]

export type banned = {
    id: string,
    name: string,
    icon: string
}[]

export type muted = {
    id: string,
    name: string,
    icon: string
}[]

export type messages = {
    id: string,
    text: string,
    sender: string,
    senderId: string,
    time: Date,
    read: boolean,
}[]

export type channelType = {
	id: string,
	title: string,
	description: string,
	type: string,
	password: string | null,
	icon: string,
	updatedAt: Date,
	owner: owner,
	admins: admins,
	members: members,
	banned: banned,
	muted: muted,
	messages: messages,
  };