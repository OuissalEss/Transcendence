import '../assets/Profile.css'


import {useSocket} from "../App.tsx";
import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import Notifications from '../components/Notifications';
import { useQuery, gql } from "@apollo/client";

import { Link } from "react-router-dom";
import { useAuth } from '../provider/authProvider';

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
// icons
import ChevRight from '/Icons/ChevronRight.png';
import ChevLeft from '/Icons/ChevronLeft.png';

import CircleSettings from '/Icons/CircleSettings.png';
import Achievement from '../types/achievement-interface';
import User from '../types/user-interface';



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
        getAllUsers {
          id
          username
          avatar {
              filename 
          }
          xp
          winner{id}
        }
        getUserFriends {
            id
            username
            status
            avatar{filename}
            createdAt
        }
    }
`;
const achievements = [
  { enum: 'welcome', title: 'Welcome to the Arena', image: WelcomeWithoutB, createdAt: '' },
  { enum: 'robot', title: 'Robot Champion', image: RobotWithoutB, createdAt: '' },
  { enum: 'social', title: 'Social Paddler', image: FirstfWithoutB, createdAt: '' },
  { enum: 'winning', title: 'Winning Streak', image: FiveWithoutB, createdAt: '' },
  { enum: 'loyal', title: 'Loyal Opponent', image: ThreeWithoutB, createdAt: '' },
  { enum: 'team', title: 'Team Spirit', image: RoomWithoutB, createdAt: '' },
];

type Interplays = {
  icon: string;
  description: string;
  createdAt: string;
};
interface Friend {
    id: string,
    username: string,
    status: string,
    image: string
}
interface TopFive {
  id: string,
  name: string,
  image: string,
  xp: number,
  wins: number,
  leaderboard: string
}
function Profile() {
    // const achievements = [WelcomeWithoutB, FiveWithoutB, ThreeWithoutB, FirstfWithoutB, RobotWithoutB, RoomWithoutB];
    const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
    const [FriendsList, setFriendsList] = useState<Friend[]>([]);

    // useEffect(() => {
    //         if (!users || !friends || !userData) return;
    //         const updatedFriendsList: Friend[] = friends.map((friend) => ({
    //             id: friend.id,
    //             username: friend.username,
    //             status: friend.status,
    //             image: friend.avatar?.filename || ''
    //         }));

    //         setFriendsList(updatedFriendsList);

    //         const xp = userData.xp;
    //         const level = Math.sqrt(xp) / 10;
    //         const currentLevel = Math.floor(level);
    //         const nextLevel = currentLevel + 1;
    //         // Calculate level progress (percentage)
    //         const levelProgress = ((xp - currentLevel * currentLevel * 100) / ((nextLevel * nextLevel * 100) - (currentLevel * currentLevel * 100))) * 100;
    //         setLevelData({ currentLevel, nextLevel, levelProgress });
    // }, [users, friends, userData]);

    const { token } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState<User>();
    const [friends, setFriends] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
  
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
                  setUsers(data.getAllUsers);
                  setFriends(data.getUserFriends);
              }
          })
          .catch(error => {
              setLoading(false);
              console.error('Error fetching friends:', error);
          });

    let updatedFriendsList: Friend[] = {
      id: '',
      username: '',
      status: '',
      image: ''
    }
    if (friends){
      updatedFriendsList = friends.map((friend) => ({
          id: friend.id,
          username: friend.username,
          status: friend.status,
          image: friend.avatar?.filename || ''
      }));
    }
    setFriendsList(updatedFriendsList);

  }, []);
  if (!users || !friends || !userData) return;

    let xp = userData.xp;
    const level = Math.sqrt(xp) / 10;
    const currentLevel = Math.floor(level);
    const nextLevel = currentLevel + 1;
    // Calculate level progress (percentage)
    const levelProgress = ((xp - currentLevel * currentLevel * 100) / ((nextLevel * nextLevel * 100) - (currentLevel * currentLevel * 100))) * 100;

    console.log("USER = ", userData);
    console.log("blocking = ", userData?.blocking.length);
    console.log("friends = ", FriendsList);
  // Achievement
      type Achievement = {
        enum: string;
        title: string;
        image: string;
        createdAt: string;
      };
      const myAchievements: Achievement[] = [];
      userData?.achievements?.forEach(userAchievement => {
          let a = achievements.find(achievement => achievement.enum === userAchievement.achievement);
          if (a) {
              a.createdAt = userAchievement.createdAt;
              myAchievements.push(a);
          }
      });
  // Interplays
      const myInterplays: Interplays[] = myAchievements.map((achievement) => {
          return {
              icon: '🏆',
              description: `Completed a new achievement: ${achievement.title}`,
              createdAt: achievement.createdAt
          };
      });
      friends.forEach(friend => {
        myInterplays.push({
            icon: "🤍",
            description: `Just added a new friend '${friend.username}'!`,
            createdAt: new Date().toISOString()
        });
      });
      myInterplays.push({ icon: "🎁", description: "Received a special reward for logging in for the first time: + 50xp", createdAt: userData?.createdAt,});
      myInterplays.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      const playedGames = userData?.host.length + userData?.guest.length;
      if (playedGames == 1 )
        myInterplays.unshift({ icon: "🏓", description: `You have played ${playedGames} game!`, createdAt: new Date().toISOString(),});
      else
        myInterplays.unshift({ icon: "🏓", description: `You have played ${playedGames} games`, createdAt: new Date().toISOString(),});
  // Top 5
      const sortedUsers: User[] = [...users];
      sortedUsers.sort((a, b) => { return b.xp - a.xp});
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
      if (topFive){
        if (userData.id == topFive[0]?.id) myLeaderboard = Leaderboard1;
        if (userData.id == topFive[1]?.id) myLeaderboard = Leaderboard2;
        if (userData.id == topFive[2]?.id) myLeaderboard = Leaderboard3;
        if (userData.id == topFive[3]?.id) myLeaderboard = Leaderboard4;
      }
  // Wins | Draw | Losses
      const myWins = userData?.winner.length;
      const myLosses = userData?.loser.length;
      const myDraws = playedGames - (myWins + myLosses);

    const handlePrevAchievement = () => {
        const newIndex = currentAchievementIndex === 0 ? myAchievements.length - 1 : currentAchievementIndex - 1;
        setCurrentAchievementIndex(newIndex);
    };
    const handleNextAchievement = () => {
        const newIndex = (currentAchievementIndex + 1) % myAchievements.length;
        setCurrentAchievementIndex(newIndex);
    };

  if (isLoading)
    return <GameLoading />
  return (
    <div className="Profile">
      <header className="Profile-header">
        <div className="SearchBarP">
          <SearchBar />
        </div>
        <div className="NotificationBarP">
          <Notifications />
        </div>
        <div className="ProfileTitle">
          <h1>Profile</h1>
          <div className="ProfileBar">
              <img src={userData?.avatar.filename} className="AvatarPro" alt="Avatar" />
              <div className="ProfileName"><p>{userData?.username}</p></div>
              <img src={myLeaderboard} className="LeaderboardPro" alt="Leaderboard" />
              <div className="LevelTube">
                  <div className="LevelMarker">Lv.{currentLevel}</div>
                  <div className="Tube">
                      <div className="LevelProgress" style={{ width: `${levelProgress}%` }}><span>{levelProgress.toFixed(0)}%</span></div>
                  </div>
                  <div className="LevelMarker">Lv.{currentLevel+1}</div>
              </div>
              <div className="Stats">
              <p className="StatText">{myWins} Wins&nbsp;&nbsp;|&nbsp;&nbsp;{myDraws} Draw&nbsp;&nbsp;|&nbsp;&nbsp;{myLosses} Losses</p>
              </div>
          </div>
        </div>
        <div className="CurrTitle">
          <h1>Current Interplays</h1>
          <div className="CurrBar">
            <ul className="InterplaysList">
              {myInterplays?.map(({ icon, description, }, index) => {
                return (
                  <li key={index}><span>{icon}</span> {description}</li>
                );
              })}
              {/* <li><span>💰</span> Earned 50 points in a game</li> */}
            </ul>

          </div>
        </div>
        <div className="FrLiTitle">
          <h1>Friends List</h1>
          <div className="FrLiBar">
            <ul className="FriendsList">
              {FriendsList?.map(({ id, username,  image }, index) => {
                return (
                  <div key={index}>
                      <li>
                          <img src={image} className="FriendAvatar" alt="Friend1" />
                          <span className="FriendName">{username}</span>
                          <Link to={`/profiles?id=${id}`}><img src={CircleSettings} className="CircleSettings" alt="Settings" /></Link>
                      </li>
                      <hr className="Separator" />
                  </div>
                );
              })}
            </ul>
          </div>

        </div>
        <div className="AchievementsTitle">
            <h1>Achievements</h1>
            <div className="AchievementsBar">


                <div className="ChevLeftC" onClick={handlePrevAchievement}>
                  <img src={ChevLeft} alt="Left Chevron" className="ChevLeft" />
                </div>
                <div className="AchievementContainer">
                    <img src={myAchievements[currentAchievementIndex]?.image} className="Achievement" alt="Achievement" />
                    <span>{myAchievements[currentAchievementIndex]?.title}</span>
                </div>
                <div className="ChevRightC" onClick={handleNextAchievement}>
                  <img src={ChevRight} alt="Right Chevron" className="ChevRight" />
                </div>


            </div>
        </div>
          <div className="PTtitle">
            <h1>Playthrough Legacy</h1>
              <div className="PTBar">


              <ul >
              {FriendsList.map(({ username,  image }, index) => {
                return (
                  <li key={index} className="play">
                    <div className="PlayerLeft">
                      <img src={image} className="LeftPlayer" alt={username} />
                      <p className="PlayerName">{username}</p>
                    </div>
                    <p className="ScoreP">2&nbsp;&nbsp;-&nbsp;&nbsp;5</p>
                    <div className="PlayerRight">
                      <img src={image} className="RightPlayer" alt={username} />
                      <p className="PlayerName">{username}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            
                <div className="play">
                </div>
              </div>
          </div>
              
                
      </header>
    </div>
  );
}

export default Profile;
