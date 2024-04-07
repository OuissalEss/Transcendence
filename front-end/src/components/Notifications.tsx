import { useState, useRef, useEffect } from 'react';
import Notifs from '../types/notifications-interface';
import { Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useSocket } from "../App.tsx";
import Leaderboard1 from "*.png";
import { useAuth } from '../provider/authProvider.tsx';
import { useMutation } from '@apollo/react-hooks'

const USER_DATA_QUERY = `
    query {
        getUserNotifications{
            id
            time
            type
            isRead
            receiver{id}
            sender{
                id
                username
                avatar {
                    filename
                }
            }
        }
    }`;

const UPDATE_READ = gql`
    mutation($id: String!) {
        updateIsRead(id: $id){
            id
        }
    }
`;

const Notifications = () => {
    const [updateNotifIsRead] = useMutation(UPDATE_READ);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState<{ id: string, userId: string, type: string, isRead: boolean, notif: string }[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [notifs, setNotifs] = useState<Notifs[]>([]);
    const { token } = useAuth();
    const { socket } = useSocket();
    useEffect(() => {
        if (socket == undefined) return;

        socket.on('RequestReceived', ({ username, userId, image }: { username: string, userId: string, image: string }) => {
            alert(`Friend Request Recieved from  ${username}`);
        })

        socket.on('RequestAccepted', ({ username, userId, image }: { username: string, userId: string, image: string }) => {
            alert(`${username} Accepted your request`);
        })
    }, [socket]);
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
                if (data && data.getUserNotifications) {
                    setNotifs(data.getUserNotifications);
                }
            })
            .catch(error => {
                console.error('Error fetching friends:', error);
            });
    }, []);
    console.log("notifs = ", notifs);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const updateNotifications = () => {

        let notifications1: {
            id: string;
            userId: string;
            type: string;
            isRead: boolean;
            notif: string;
        }[] = [];

        notifications1 = notifs.map(n => {
            if (n.type === 'FRIEND_REQUEST') {
                return {
                    id: n.id,
                    userId: n.sender.id,
                    type: n.type,
                    isRead: n.isRead,
                    notif: `${n.sender.username} sent you a friend request`
                };
            } else {
                return {
                    id: n.id,
                    userId: n.sender.id,
                    type: n.type,
                    isRead: n.isRead,
                    notif: `New Achievement`// Assuming you want to keep the original notification for other types
                };
            }
        });
        setNotifications(notifications1);
    }
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        updateNotifications();
    };

    const updateIsRead = async (notifId: string) => {
        try {
            await updateNotifIsRead({ variables: { id: notifId } });
            console.log("Read updated successfully!");
        } catch (error) {
            console.error("Error updating Read:", error.message);
        }
    };

    return (
        <div className='notifs'>
            <div className="bellDiv" onClick={toggleDropdown}>
                <img
                    className="bellImg"
                    src="/Icons/Bell.png"
                    alt="search"
                />
            </div>
            {showDropdown && (
                <div className="notificationDropdown" ref={dropdownRef}>
                    {/* Display notifications */}
                    <ul className="notificationList">
                        {notifications.map((notification, index) => (
                            notification ? (
                                notification.isRead == false ? (
                                    <Link key={index} to={`/profiles?id=${notification.userId}`} onClick={() => updateIsRead(notification.id)}>
                                        <li className="notif" key={index}>{notification.notif}</li>
                                    </Link>
                                ) : null
                            ) : null
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Notifications;
