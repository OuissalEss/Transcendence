'use client';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "../types/user-interface.tsx";
import { useAuth } from "../provider/authProvider.tsx";
import { useSocket } from "../App.tsx";

interface Friend {
    id: string,
    username: string,
    status: string,
    image: string,
}

const USER_DATA_QUERY = `
    query UserData {
        getUserFriends {
            id
            username
            status
            avatar {
                id
                filename
            }
            createdAt
            blocked {
                blockedUserId
            }
            blocking {
                blockerId
            }
        }
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
            blocked {
                blockedUserId
            }
            blocking {
                blockerId
            }
            winner{id}
            loser{id}
            host{id}
            guest{id}
            createdAt
        }
    }
`;
const Friends = () => {
    // const { userData } = useSocket();
    const [userData, setUserData] = useState<User>();
    const [FriendsList, setFriendsList] = useState<Friend[]>([]);

    const { token } = useAuth();
    const { socket } = useSocket();

    console.log('friend');


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
                if (data && data.getUserFriends) {
                    const friends = data.getUserFriends;

                    const updatedFriendsList: Friend[] = friends.map((friend: any) => ({
                        id: friend.id,
                        username: friend.username,
                        status: friend.status,
                        image: friend.avatar?.filename || ''
                    }));
                    const friendsItems = friends?.map((user: { id: string, username: string, avatar: { filename: string }, status: string, xp: number, blocked: { blockedUserId: string; }[], blocking: { blockerId: string; }[] }) => ({
                        id: user.id,
                        name: user.username,
                        icon: user?.avatar?.filename || '/Avatars/default.jpeg', // Assuming avatarTest is the avatar URL
                        status: user.status,
                        xp: user.xp,
                        blocked: user.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
                        blocken: user.blocking.map((blocker: { blockerId: string }) => blocker.blockerId)
                    }));
                    localStorage.setItem('friends', JSON.stringify(friendsItems));
                    setFriendsList(updatedFriendsList);
                } if (data && data.getUserInfo) {
                    setUserData(data.getUserInfo);
                    // localStorage.setItem('user', JSON.stringify({ id: userData?.id, username: userData?.username, icon: userData?.avatar?.filename || '/Avatars/default.jpeg', }));
                }
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });
    }, []);

    console.log(userData?.id + "hhh")

    useEffect(() => {
        function refetch() {
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
                    if (data && data.getUserFriends) {
                        const friends = data.getUserFriends;

                        const updatedFriendsList: Friend[] = friends.map((friend: any) => ({
                            id: friend.id,
                            username: friend.username,
                            status: friend.status,
                            image: friend.avatar?.filename || ''
                        }));
                        const friendsItems = friends?.map((user: { id: string, username: string, avatar: { filename: string }, status: string, xp: number, blocked: { blockedUserId: string; }[], blocking: { blockerId: string; }[] }) => ({
                            id: user.id,
                            name: user.username,
                            icon: user?.avatar?.filename || '/Avatars/default.jpeg', // Assuming avatarTest is the avatar URL
                            status: user.status,
                            xp: user.xp,
                            blocked: user.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
                            blocken: user.blocking.map((blocker: { blockerId: string }) => blocker.blockerId)
                        }));
                        localStorage.setItem('friends', JSON.stringify(friendsItems));
                        setFriendsList(updatedFriendsList);
                    } if (data && data.getUserInfo) {
                        setUserData(data.getUserInfo);
                    }
                })
                .catch(error => {
                    console.error('Error fetching friends:', error);
                });
        }
        // if (socket == undefined) return;
        socket?.on('RequestAccepted', ({ }) => {
            refetch();
        })
        socket?.on('FriendRemoved', () => {
            refetch();
        })
        socket?.on('Disconnected', () => {
            console.log("HEEEEREEEE");
            refetch();
        })
    }, [socket]);


    return (
        <div>
            <menu>
                <div className="friends friends_wrapper">
                    <div className="friends_top">
                        <Link className='' to='/myprofile' >
                            <span className="my-pic" title='My Profile'>
                                <img className="friend-img" src={userData?.avatar?.filename} alt={""} referrerPolicy="no-referrer" />
                            </span>
                        </Link>
                    </div>
                    <ul className="friends_list">
                        {FriendsList.map(({ id, username, image, status }, index) => {
                            return (
                                <li className="friends_item" key={index} title={status}>
                                    <Link to={`/profiles?id=${id}`}>
                                        <div className="relative">
                                            <div className="friend-icon">
                                                <span >
                                                    <img className={`friend-img ${status}`} src={image} alt={""} referrerPolicy="no-referrer" />
                                                </span>
                                            </div>
                                            <div className="friend-name" title={username}>
                                                <span>{username.length > 9 ? `${username.slice(0, 9)}.` : username}</span>
                                            </div>
                                            <div className={`cercle s ${status}`}></div>
                                            <div className="cercle status"></div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </menu>
        </div>
    );
};

export default Friends;