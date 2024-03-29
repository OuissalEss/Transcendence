import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  query SignIn($email: String!, $username: String!) {
    SignIn(email: $email, username: $username) {
      id
      email
      username
	    avatarTest
      xp
    }
  }
`;

export const ALL_CHANNELS = gql`
  query AllChannels {
    AllChannels {
      id
      title
      description
      type
      password
      profileImage
      updatedAt
      owner {
        id
        username
        avatarTest
      }
      admins {
        id
        username
        avatarTest
      }
      members {
        id
        username
        avatarTest
        status
        blocked {
          blockedUserId
        }
        blocking {
          blockerId
        }
      }
      banned {
        id
        username
        avatarTest
      }
      muted {
        id
        username
        avatarTest
      }
      messages {
        id
        text
        time
				sender
        senderId
      }
    }
  }
`;

export const ALL_MUTES = gql`
  query AllMutes {
    AllMutes {
      id
    }
  }
`;

export const CHANNEL_BY_ID = gql`
  query ChannelById($id: String!) {
    ChannelById(id: $id) {
      id
      title
      description
      type
      password
      profileImage
      updatedAt
      members {
        id
        username
        avatarTest
        status
      }
      muted {
        id
        username
        avatarTest
      }
      messages {
        id
        text
        time
        sender
        senderId
      }
    }
  }
`;

export const CHANNEL_BY_TITLE = gql`
  query ChannelByTitle($title: String!) {
    ChannelByTitle(title: $title) {
      id
    }
  }
`;

export const CHANNELS_BY_DESCRIPTION = gql`
  query ChannelsByDescription($description: String!) {
    Description(description: $description) {
      id
    }
  }
`;

export const CHANNEL_BY_TYPE = gql`
  query ChannelByType($type: String!) {
    ChannelByType(type: $type) {
      id
    }
  }
`;

export const MUTE_LIST_BY_CHANNEL_ID = gql`
  query MuteListByChannelId($cid: String!) {
    MuteListCid(cid: $cid) {
      id
    }
  }
`;

export const MUTE_LIST_BY_USER_ID = gql`
  query MuteListByUserId($uid: String!) {
    MuteListUid(uid: $uid) {
      id
    }
  }
`;

export const CHANNEL_OWNER = gql`
  query ChannelOwner($owner: String!) {
    Owner(owner: $owner) {
      id
    }
  }
`;

export const MUTE_DURATION = gql`
  query MuteDuration($cid: String!, $uid: String!) {
    duration(cid: $cid, uid: $uid)
  }
`;

export const ALL_CHANNEL_USERS = gql`
  query GetAllChannelUsers {
    getAllChannelUsers {
      id
    }
  }
`;

export const ALL_FRIENDS = gql`
  query GetAllFriends {
    getAllFriends {
      id
    }
  }
`;

export const ALL_MESSAGES = gql`
  query GetAllMessages {
    getAllMessages {
      id
    }
  }
`;

export const MESSAGES_BY_CHANNEL_ID = gql`
  query GetAllMessagesByChannelId($cid: String!) {
    getAllMessagesByChannelId(cid: $cid) {
      id
    }
  }
`;

export const ALL_NOTIFICATIONS = gql`
  query GetAllNotifications {
    getAllNotifications {
      id
    }
  }
`;

export const ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      username
      avatarTest
      status
      xp
    }
  }
`;

export const CHANNEL_USER_BY_ID = gql`
  query GetChannelUserById($id: String!) {
    getChannelUserById(id: $id) {
      id
    }
  }
`;

export const FRIEND_BY_ID = gql`
  query GetFriendById {
    getFriendById(id: $id) {
      id
    }
  }
`;

export const MESSAGE_BY_ID = gql`
  query GetMessageById($id: String!) {
    getMessageById(id: $id) {
      id
    }
  }
`;

export const USER_BY_ID = gql`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      id
    }
  }
`;

export const IS_PERMANENT_MUTE = gql`
  query IsPermanentMute($cid: String!, $uid: String!) {
    isPermanent(cid: $cid, uid: $uid)
  }
`;

export const OWNED_CHANNELS = gql`
  query OwnedChannels($owner: String!) {
    ownedChannels(owner: $owner) {
      id
    }
  }
`;

export const IS_BLOCKED = gql`
  query IsBlocked($blockerId: String!, $blockedUserId: String!) {
    isBlocked(blockerId: $blockerId, blockedUserId: $blockedUserId)
  }
`;
