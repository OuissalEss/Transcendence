import { useNavigate } from 'react-router-dom';
import { useQuery, gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks'


import '../assets/profiles.css';
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
// Leaderboards
import Leaderboard1 from '/Leaderboard/Leaderboard1.png';
import Leaderboard2 from '/Leaderboard/Leaderboard2.png';
import Leaderboard3 from '/Leaderboard/Leaderboard3.png';
import Leaderboard4 from '/Leaderboard/Leaderboard4.png';
import Leaderboard5 from '/Leaderboard/Leaderboard5.png';

import ChevRight from '/Icons/ChevronRight.png';
import ChevLeft from '/Icons/ChevronLeft.png';

import Friend from '../types/friend-interface';
import { useSocket } from '../App';

const USER_DATA = `
query($user_id: String!) {
    getUserFriends {
        id
        username
        status
        avatar{filename}
    }
    getUserInfo {
        id
        username
        xp
        avatar{filename}
        achievements{
            achievement
            createdAt
        }
        winner{id}
        loser{id}
        host{id}
        guest{id}
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
    getAllUsers {
        id
        username
        avatar {
            filename 
        }
        xp
        winner{id}
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
      winner{id}
      loser{id}
      host{id}
      guest{id}
    }
    getAllMatches(userId: $user_id) {
      id
      host_score_m
      guest_score_m
      host{
        id
        username
        avatar{filename}
      }
      guest{
        id
        username
        avatar{filename}
      }
      createdAt
    }
}`;



const achievements = [
  { enum: 'welcome', title: 'Welcome to the Arena', image: WelcomeWithoutB },
  { enum: 'robot', title: 'Robot Champion', image: RobotWithoutB },
  { enum: 'social', title: 'Social Paddler', image: FirstfWithoutB },
  { enum: 'winning', title: 'Winning Streak', image: FiveWithoutB },
  { enum: 'loyal', title: 'Loyal Opponent', image: ThreeWithoutB },
  { enum: 'team', title: 'Team Spirit', image: RoomWithoutB },
];
interface TopFive {
  id: string,
  name: string,
  image: string,
  xp: number,
  wins: number,
  leaderboard: string
}

function Profiles() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>();
  const [users, setUsers] = useState<User[]>();
  const [friends, setFriends] = useState<User[]>();
  const [receiver, setReceiver] = useState<Friend[]>();
  const [sender, setSender] = useState<Friend[]>();
  const [isLoading, setLoading] = useState(true);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [buttonText, setbuttonText] = useState('');
  const [friendShipId, setfriendShipId] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);

  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');

  const token: string | undefined = Cookies.get('token');
  const decodedToken = jwtDecode(token || '');
  const userId = decodedToken.sub;

  const { socket } = useSocket();

  useEffect(() => {
    if (id == userId) {
      navigate('/myprofile');
    }
  }, []);

  useEffect(() => {
    if (!token) return; // If token is not available, do nothing

    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query: USER_DATA, variables: { user_id: id }
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(({ data }) => {
        if (data && data.getAllUsers) {
          console.log("data = ", data)
          setUserData(data.getUserById);
          setUsers(data.getAllUsers);
          setFriends(data.getUserFriends);
          setReceiver(data.getUserFriendsReceiver);
          setSender(data.getUserFriendsSender);
          setMatches(data.getAllMatches);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching friends:', error);
      });
  }, []);
  console.log("user = ", userData);

  useEffect(() => {
    if (socket === undefined) return;

    socket.on('RequestReceived', ({ username, userId, image, friendId }: { username: string, userId: string, image: string, friendId: string }) => {
      setbuttonText('accept')
      setfriendShipId(friendId);
    })

    socket.on('RequestAccepted', ({ username, userId, image }: { username: string, userId: string, image: string }) => {
      setbuttonText('remove')
    })

    socket.on('AcceptedRequest', ({ friendId }: { friendId: string }) => {
      setbuttonText('remove')
      setfriendShipId(friendId);
    });

    socket.on('RequestSent', ({ friendId }: { friendId: string }) => {
      setbuttonText('cancel');
      setfriendShipId(friendId);
    });
    socket.on('FriendRemoved', () => {
      setbuttonText('add');
      setfriendShipId('');
    });
    if (sender === undefined || receiver === undefined) return;

    let senderFriendShip = sender.find(friend => friend.receiver.id === id);
    let receiverFriendShip = receiver.find(friend => friend.sender.id === id);

    if (senderFriendShip) {
      setfriendShipId(senderFriendShip.id);
      if (senderFriendShip.isAccepted == true) setbuttonText('remove');
      else setbuttonText('cancel');
    } else if (receiverFriendShip) {
      setfriendShipId(receiverFriendShip.id);
      if (receiverFriendShip.isAccepted == true) setbuttonText('remove');
      else setbuttonText('accept');
    } else setbuttonText('add');
  }, [socket, sender, receiver]);


  if (!userData) return
  if (!users) return
  if (!friends) return
  if (!receiver) return
  if (!sender) return

  // Top 5
  const sortedUsers: User[] = [...users];
  sortedUsers.sort((a, b) => { return b.xp - a.xp });
  let topFive: TopFive[] = sortedUsers.slice(0, 5).map((player) => ({
    id: player.id,
    name: player.username,
    image: player.avatar?.filename || '/Avatars/default.jpeg',
    xp: player.xp,
    wins: player.winner.length,
    leaderboard: Leaderboard1
  }));
  topFive.sort((a, b) => {
    if (b.xp == a.xp)
      return b.wins - a.wins
  });

  // Leaderboard
  let myLeaderboard = Leaderboard5;
  if (topFive) {
    if (userData.id == topFive[0]?.id) myLeaderboard = Leaderboard1;
    if (userData.id == topFive[1]?.id) myLeaderboard = Leaderboard2;
    if (userData.id == topFive[2]?.id) myLeaderboard = Leaderboard3;
    if (userData.id == topFive[3]?.id) myLeaderboard = Leaderboard4;
  }

  // Achievements
  type Achievement = {
    enum: string;
    title: string;
    image: string;
  };

  const myAchievements: Achievement[] = [];
      const uniqueAchievements: Set<string> = new Set();

      userData?.achievements?.forEach(userAchievement => {
          let a = achievements.find(achievement => achievement.enum === userAchievement.achievement);
          if (a && !uniqueAchievements.has(a.enum)) {
              a.createdAt = userAchievement.createdAt;
              myAchievements.push(a);
              uniqueAchievements.add(a.enum);
          }
      });
  // Friends
  let FriendsList = friends.map((friend: User) => ({
    id: friend.id,
    username: friend.username,
    status: friend.status,
    image: friend.avatar ? friend.avatar.filename : '/Avatars/default.jpeg'
  }));

  // calculate Level
  const xp = userData.xp;
  const level = (Math.sqrt(xp) / 10);
  const currentLevel = Math.floor(level);
  const nextLevel = currentLevel + 1;
  const levelProgress = (xp - currentLevel * currentLevel * 100) / (nextLevel * nextLevel * 100 - currentLevel * currentLevel * 100) * 100;

  // Wins | Draw | Losses
  const playedGames = userData.host.length + userData.guest.length;
  const myWins = userData?.winner.length;
  const myLosses = userData?.loser.length;
  const myDraws = playedGames - (myWins + myLosses);

  // Get relation between the user and hada li mlogi
  // let buttonText = '';


  const handlePrevAchievement = () => {
    const newIndex = currentAchievementIndex === 0 ? myAchievements.length - 1 : currentAchievementIndex - 1;
    setCurrentAchievementIndex(newIndex);
  };
  const handleNextAchievement = () => {
    const newIndex = (currentAchievementIndex + 1) % myAchievements.length;
    setCurrentAchievementIndex(newIndex);
  };

  // Update Friend Table
  const handleAddFriend = () => {
      socket?.emit("friendRequest", { senderId: userId, receiverId: id })
  }
  const handleRemoveFriend = () => {
    socket?.emit("removeFriend", { friendId: friendShipId })
  }
  const handleAcceptRequest = () => {
    socket?.emit("acceptRequest", { friendId: friendShipId });
  }
  const handleCancelRequest = () => {
    socket?.emit("removeFriend", { friendId: friendShipId })
  }

  return (
    <div className="Profile">
      <div className="grid grid-cols-2 header_myProfile mb-[30px]">
        <div className='col-span-1 text-while'>
            <SearchBar />
        </div>

        <div className='col-span-1'>
            <Notifications />
        </div>
      </div>
      <div className="PlayerProfile">{userData.username}'s Profile</div>
        <div className="PlayerBar">
          
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
          <img src={myLeaderboard} className="LB" alt="Leaderboard3" />
          <div className="PLevelTube">
            <div className="PLevelMarker">Lv.{currentLevel}</div>
            <div className="PTube">
              <div className="PLevelProgress" style={{ width: `${levelProgress}%` }}><span>{levelProgress.toFixed(0)}%</span></div>
            </div>
            <div className="PLevelMarker">Lv.{nextLevel}</div>
          </div>
          <div className="PStats">
            <p className="PStatText">{myWins}&nbsp;Wins&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{myDraws}&nbsp;Draw&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;{myLosses}&nbsp;Losses</p>
          </div>
        </div>
      <div className="PlayerResp grid grid-cols-2 mt-[30px]">
        <div className='col-span-1 '>
          <div className="PAchievements ">Achievements
          </div>

          <div className="PAchievementBar ">
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
          
        </div>

      <div className='col-span-1  ml-[10px]'>
        <div className="PPL ">Playthrough Legacy</div>
          <div className="PPLBar">
            <ul >
                  {matches.map((match, index) => {
                    return (
                      <li key={index} className="play">
                        <div className="PlayerLeft">
                          <img src={match.host.avatar.filename} className="LeftPlayer" alt={match.host.username} />
                          <p className="PlayerName" title={match.host.username}>{match.host.username}</p>
                        </div>
                        <p className="ScoreP">{match.host_score_m} - {match.guest_score_m}</p>
                        <div className="PlayerRight">
                          <img src={match.guest.avatar.filename} className="RightPlayer" alt={match.guest.username} />
                          <p className="PlayerName" title={match.guest.username}>{match.guest.username}</p>
                        </div>
                      </li>
                    );
                  })}
            </ul>
        
        </div>

      </div>

        </div>
    </div>
  );
}

export default Profiles;