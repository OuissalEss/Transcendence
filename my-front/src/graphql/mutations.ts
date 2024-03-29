import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($avatar: String!, $email: String!,  $usrnm: String!) {
    createUser(avatar: $avatar, email: $email, usrnm: $usrnm) {
      id
      username
      avatarTest
    }
  }
`;

export const ADD_ADMIN = gql`
  mutation AddAdmin($cid: String!, $uid: String!) {
    addAdmin(cid: $cid, uid: $uid) {
      id
      username
      avatarTest
    }
  }
`;

export const ADD_MEMBER = gql`
  mutation AddMember($cid: String!, $uid: String!) {
    addMember(cid: $cid, uid: $uid) {
      id
      username
      avatarTest
      status
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation CreateChannel($createChannelInput: CreateChannelInput!) {
    createChannel(createChannelInput: $createChannelInput) {
      id
      title
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
			}
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      text
      time
      channelId {
        userId
      }
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: String!) {
    deleteMessage(id: $id) {
      id
    }
  }
`;

export const DELETE_CHANNEL_USER = gql`
  mutation DeleteChannelUser($id: String!) {
    deleteChannelUser(id: $id) {
      id
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
    }
  }
`;

export const JOIN_CHANNEL = gql`
  mutation JoinChannel($cid: String!, $uid: String!) {
    joinChannel(cid: $cid, uid: $uid) {
      id
    }
  }
`;

export const LEAVE_CHANNEL = gql`
  mutation LeaveChannel($cid: String!, $uid: String!) {
    leaveChannel(cid: $cid, uid: $uid) {
      id
    }
  }
`;

export const MUTE_USER = gql`
  mutation MuteUser($cid: String!, $duration: DateTime!, $permanent: Boolean!, $uid: String!) {
    muteUser(cid: $cid, duration: $duration, permanent: $permanent, uid: $uid) {
      id
    }
  }
`;

export const REMOVE_ADMIN = gql`
  mutation RemoveAdmin($cid: String!, $uid: String!) {
    removeAdmin(cid: $cid, uid: $uid) {
      id
    }
  }
`;

export const REMOVE_MEMBER = gql`
  mutation RemoveMember($cid: String!, $uid: String!) {
    removeMember(cid: $cid, uid: $uid) {
      id
    }
  }
`;

export const UNMUTE_USER = gql`
  mutation UnmuteUser($cid: String!, $uid: String!) {
    unmuteUser(cid: $cid, uid: $uid) {
      id
    }
  }
`;

export const UPDATE_AVATAR = gql`
  mutation UpdateAvatar($avatar: String!, $uid: String!) {
    updateAvatar(avatar: $avatar, uid: $uid) {
      id
    }
  }
`;

export const UPDATE_CHANNEL_DESCRIPTION = gql`
  mutation UpdateChannelDescription($cid: String!, $description: String!) {
    updateChannelDescription(cid: $cid, description: $description) {
      id
    }
  }
`;

export const UPDATE_CHANNEL_PASSWORD = gql`
  mutation UpdateChannelPassword($cid: String!, $password: String!) {
    updateChannelPassword(cid: $cid, password: $password) {
      id
    }
  }
`;

export const UPDATE_CHANNEL_PROFILE_IMAGE = gql`
  mutation UpdateChannelProfileImage($cid: String!, $profileImage: String!) {
    updateChannelProfileImage(cid: $cid, profileImage: $profileImage) {
      id
    }
  }
`;

export const UPDATE_CHANNEL_TITLE = gql`
  mutation UpdateChannelTitle($cid: String!, $title: String!) {
    updateChannelTitle(cid: $cid, title: $title) {
      id
    }
  }
`;

export const UPDATE_CHANNEL_TYPE = gql`
  mutation UpdateChannelType($cid: String!, $type: ChannelType!) {
    updateChannelType(cid: $cid, type: $type) {
      id
    }
  }
`;

export const UPDATE_CHANNEL_TYPE_USER = gql`
  mutation UpdateChannelTypeUser($id: String!, $type: String!) {
    updateChannelTypeUser(id: $id, type: $type) {
      id
    }
  }
`;

export const UPDATE_FIRST_NAME = gql`
  mutation UpdateFirstName($firstname: String!, $userId: String!) {
    updateFirstName(firstname: $firstname, userId: $userId) {
      id
    }
  }
`;

export const UPDATE_LAST_NAME = gql`
  mutation UpdateLastName($lastname: String!, $userId: String!) {
    updateLastName(lastname: $lastname, userId: $userId) {
      id
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation UpdateMessage($mid: String!, $text: String!) {
    updateMessage(mid: $mid, text: $text) {
      id
    }
  }
`;

export const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($status: String!, $userId: String!) {
    updateUserStatus(status: $status, userId: $userId) {
      id
    }
  }
`;

export const UPDATE_USERNAME = gql`
  mutation UpdateUsername($userId: String!, $username: String!) {
    updateUsername(userId: $userId, username: $username) {
      id
    }
  }
`;
