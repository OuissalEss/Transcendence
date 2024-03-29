import React from "react";
import friend1 from '../../../public/assets/Avatars/02.jpeg';
import friend2 from '../../../public/assets/Avatars/03.jpeg';
import friend3 from '../../../public/assets/Avatars/14.png';
import friend4 from '../../../public/assets/Avatars/18.png';
import test from '../../../public/assets/Avatars/06.png'
import './friendsBar.css';
import { useQuery } from '@apollo/client';
import { ALL_USERS } from '../../graphql/queries';

function FriendsBar() {

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let friendsItems;
  

  // query all the users
  const { loading, error, data } = useQuery(ALL_USERS);
  if (loading) console.log('Loading...');
  if (error) console.log('Error:', error.message);
  if (data) {
    // console.log('All users:', data);
    // console.log('All users:', data.getAllUsers);
    friendsItems = data.getAllUsers
    .filter((u: { username: string }) => u.username !== user.username)
    .map((user: { id: string, username: string, avatarTest: string, status: string, xp: number, blocked: {blockedUserId: string;}[], blocking: {blockerId: string;}[] }) => ({
      id: user.id,
      name: user.username,
      icon: user.avatarTest, // Assuming avatarTest is the avatar URL
      status: user.status,
      xp: user.xp,
      blocked: user.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
      blocken: user.blocking.map((blocker: { blockerId: string }) => blocker.blockerId)
    }));
    // console.log('All friends:', friendsItems);
    // save the friends in local storage
    localStorage.setItem('friends', JSON.stringify(friendsItems));
  }
  else {
    friendsItems = [
      { name: "Stella", icon: friend1, status: "ONLINE", xp: Math.floor(Math.random() * 100) },
    ];
  }

  return (
        <div className="friends-sidebar fixed z-10">
          <div className="friends-sidebar__container items-center z-10">
          <div className="friends-sidebar__top z-10">
    		    <img src={user.avatarTest} title={user.username} className="rounded-full" />
    	    </div>
            <ul className="friends-sidebar__list">
              {friendsItems.map((item: { name: string, icon: string, status: string }, index: number) => (
                <li className="friends-sidebar__item" key={index}>
                  <img className="w-16 h-16 rounded-full" src={item.icon} alt={item.name} />
                  <span className={`status-indicator ${getStatusColor(item.status)}`} />
                </li>
              ))}
            </ul>
          </div>
        </div>
  );
}

// Function to determine status color
function getStatusColor(status: string) {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "OFFLINE":
      return "bg-red-500";
    case "AWAY":
      return "bg-yellow-500";
    case "INGAME":
      return "bg-blue-500";
    default:
      return "";
  }
}

export default FriendsBar;
