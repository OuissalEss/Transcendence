
import { useNavigate } from 'react-router-dom';
import Leaderboard3 from '/Leaderboard/Leaderboard3.png';
import { useQuery, gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks'


import '../assets/profiles.css';
// import './Profile.css'
import DashboardLayout from '../layouts/LayoutDefault';
import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';
import { useEffect, useState } from 'react';
import User from '../types/user-interface';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";
// Achievements
import FirstfWithoutB from '/Achievements/FirstfWithoutB.png';
import FiveWithoutB from '/Achievements/FiveWithoutB.png';
import RobotWithoutB from '/Achievements/RobotWithoutB.png';
import RoomWithoutB from '/Achievements/RoomWithoutB.png';
import ThreeWithoutB from '/Achievements/ThreeWithoutB.png';
import WelcomeWithoutB from '/Achievements/WelcomeWithoutB.png';

import ChevRight from '/Icons/ChevronRight.png';
import ChevLeft from '/Icons/ChevronLeft.png';

import Loading from '../components/Loading';
import Friend from '../types/friend-interface';

const USER_DATA = gql`
query($user_id: String!) {
  getUserFriends {
      id
      username
      status
      avatar{filename}
  }
    getUserById(id: $user_id) {
        id
        username
        xp
        avatar{filename}
        achievements{
            achievement
            createdAt
        }
    }
    getUserFriendsSender {
      id
      isAccepted
      receiver{id}
    }
    getUserFriendsReceiver {
      id
      isAccepted
      sender{id}
    }
}
`;

const UPDATE_IS_ACCEPTED = gql`
  mutation($f_id: String!) { 
    updateAccept(friendId: $f_id) {
          id
      }
  }
`;

const DELETE_FRIEND = gql`
  mutation($f_id: String!) {
    deleteFriend(friendId: $f_id) {
      id
    }
  }
`;

const CREATE_FRIEND = gql`
  mutation($receiver_id: String!, $sender_id: String!) {
    createFriend(receiverId: $receiver_id, senderId: $sender_id) {
        id
    }
  }
`;

const achievements = [
  { enum: 'welcome', title: 'Welcome to the Arena', image: WelcomeWithoutB },
  { enum: 'robot', title: 'Robot Champion', image: RobotWithoutB },
  { enum: 'social', title: 'Social Paddler', image: FirstfWithoutB },
  { enum: 'winning', title: 'Winning Streak', image: FiveWithoutB },
  { enum: 'loyal', title: 'Loyal Opponent', image: ThreeWithoutB },
  { enum: 'team', title: 'Team Spirit', image: RoomWithoutB },
];

function Profiles() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>();
  const [friends, setFriends] = useState<User[]>();
  const [receiver, setReceiver] = useState<Friend[]>();
  const [sender, setSender] = useState<Friend[]>();
  const [isLoading, setLoading] = useState(true);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);

  const [updateIsAccepted] = useMutation(UPDATE_IS_ACCEPTED);
  const [deleteFriend] = useMutation(DELETE_FRIEND);
  const [createFriend] = useMutation(CREATE_FRIEND);

  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');
  const token: string | undefined = Cookies.get('token');
  const decodedToken = jwtDecode(token || '');
  const userId = decodedToken.sub;
  useEffect(() => {
    if (id == userId) {
      navigate('/myprofile');
    }
  }, []);

  const { data, loading, error } = useQuery(USER_DATA, {
    variables: { user_id: id }
  });

  useEffect(() => {
    try {

      if (loading) setLoading(true);
      if (error) {
        throw new Error('Failed to fetch user data');
      }
      if (data) {
        setUserData(data.getUserById);
        setFriends(data.getUserFriends);
        setReceiver(data.getUserFriendsReceiver);
        setSender(data.getUserFriendsSender);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [data, loading, error]);

  if (loading) return
  if (!userData) return
  if (!friends) return
  if (!receiver) return
  if (!sender) return

  type Achievement = {
    enum: string;
    title: string;
    image: string;
  };
  const myAchievements: Achievement[] = [];
  userData?.achievements.forEach(userAchievement => {
      const a = achievements.find(achievement => achievement.enum === userAchievement.achievement);
      if (a) {
          myAchievements.push(a);
      }
  });
  console.log("Matched = ",myAchievements);

  let FriendsList = friends.map((friend: User) => ({
    id: friend.id,
    username: friend.username,
    status: friend.status,
    image: friend.avatar ? friend.avatar.filename : ''
  }));

  // calculate Level
  const xp = userData.xp;
  const level = (Math.sqrt(xp) / 10);
  const currentLevel = Math.floor(level);
  const nextLevel = currentLevel + 1;
  const levelProgress = (xp - currentLevel * currentLevel * 100) / (nextLevel * nextLevel * 100 - currentLevel * currentLevel * 100) * 100;

  // Get relation between the user and hada li mlogi
  let buttonText = '';
    console.log("SENDER = ", sender);
    console.log("RECEIVER = ", receiver);
  let senderFriendShip = sender.find(friend => friend.receiver.id === id);
  let receiverFriendShip = receiver.find(friend => friend.sender.id === id);
  let friendShipId = '';
  if (senderFriendShip) {
    friendShipId = senderFriendShip.id;
    if (senderFriendShip.isAccepted == true) buttonText = 'remove';
    else buttonText = 'cancel';
  } else if (receiverFriendShip) {
    friendShipId = receiverFriendShip.id;
    if (receiverFriendShip.isAccepted == true) buttonText = 'remove';
    else buttonText = 'accept';
  } else buttonText = 'add';

  const handlePrevAchievement = () => {
    const newIndex = currentAchievementIndex === 0 ? myAchievements.length - 1 : currentAchievementIndex - 1;
    setCurrentAchievementIndex(newIndex);
  };

  const handleNextAchievement = () => {
    const newIndex = (currentAchievementIndex + 1) % myAchievements.length;
    setCurrentAchievementIndex(newIndex);
  };

  // Update Friend Table
  const handleAddFriend = async () => {
      try {
          await createFriend({ variables: { receiver_id: id, sender_id: userId } });
          console.log("FriendShip created successfully!");
      } catch (error) {
          console.error("Error creating FriendShip:", error.message);
      }
      window.location.reload();
  }
  const handleRemoveFriend = async () => {
      try {
          await deleteFriend({ variables: { f_id: friendShipId } });
          console.log("FriendShip removed successfully!");
      } catch (error) {
          console.error("Error removing FriendShip:", error.message);
      }
      window.location.reload();
  }
  const handleAcceptRequest = async () => {
      try {
          await updateIsAccepted({ variables: { f_id: friendShipId } });
          console.log("FriendShip updated successfully!");
      } catch (error) {
          console.error("Error updating FriendShip:", error.message);
      }
      window.location.reload();
  }
  const handleCancelRequest = async () => {
      try {
          await deleteFriend({ variables: { f_id: friendShipId } });
          console.log("FriendShip removed successfully!");
      } catch (error) {
          console.error("Error removing FriendShip:", error.message);
      }
      window.location.reload();
  }

  return (
    <div className="Profile">
      <header className="Profile-header">
        <div className="PlayerBar"></div>
        <div className="PlayerProfile">{userData.username}'s Profile</div>
        <div className="PlayerName">{userData.username}</div>
        <img src={userData.avatar.filename} className="Riri" alt="Riri" />
        {buttonText == 'add' &&
          <div className="AddFriend" onClick={handleAddFriend}>Add Friend</div>
        }
        {buttonText == 'remove' &&
          <div className="AddFriend" onClick={handleRemoveFriend}>Remove Friend</div>
        }
        {buttonText == 'accept' &&
          <div className="AddFriend" onClick={handleAcceptRequest}>Accept Request</div>
        }
        {buttonText == 'cancel' &&
          <div className="AddFriend" onClick={handleCancelRequest}>Cancel Request</div>
        }
        <img src={Leaderboard3} className="LB" alt="Leaderboard3" />
        <div className="PLevelTube">
          <div className="PLevelMarker">Lv.{currentLevel}</div>
          <div className="PTube">
            <div className="PLevelProgress" style={{ width: `${levelProgress}%` }}><span>{levelProgress.toFixed(0)}%</span></div>
          </div>
          <div className="PLevelMarker">Lv.{nextLevel}</div>
        </div>
        <div className="PStats">
          <p className="PStatText">4&nbsp;Wins&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;5&nbsp;Draw&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;0&nbsp;Losses</p>
        </div>
        <div className="PAchievements">Achievements</div>
        <div className="PAchievementBar">
          <div className="PChevLeftC" onClick={handlePrevAchievement}>
            <img src={ChevLeft} alt="Left Chevron" className="PChevLeft" />
          </div>
          <div className="PAchievementContainer">
            <img src={myAchievements[currentAchievementIndex]?.image} className="Achievement" alt="Achievement" />
            <span>{myAchievements[currentAchievementIndex]?.title}</span>
          </div>
          <div className="PChevRightC" onClick={handleNextAchievement}>
            <img src={ChevRight} alt="Right Chevron" className="PChevRight" />
          </div>
        </div>
        <div className="PPL">Playthrough Legacy</div>
        <div className="PPLBar">

          <ul>
            {FriendsList.map((f, index) => {
              return (
                <li key={index} className="play">
                  <div className="PlayerLeft">
                    <img src={f.image} className="LeftPlayer" alt="LeftPlayer" />
                    <p className="PlayerName">{f.username}</p>
                  </div>
                  <p className="ScoreP">2&nbsp;&nbsp;-&nbsp;&nbsp;5</p>
                  <div className="PlayerRight">
                    <img src={f.image} className="RightPlayer" alt="RightPlayer" />
                    <p className="PlayerName">{f.username}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="SearchBarP">
          <SearchBar />
        </div>
        <div className="NotificationBarP">
          <Notifications />
        </div>
      </header>
    </div>
  );
}

export default Profiles;