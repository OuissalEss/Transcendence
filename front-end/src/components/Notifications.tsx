import { useState, useRef, useEffect } from 'react';
import Notifs from '../types/notifications-interface';
import { Link } from "react-router-dom";
import { useLazyQuery, useQuery, gql } from "@apollo/client";
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

const NOTIF_QUERY = gql`
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
    const [notifications, setNotifications] = useState<{ id: string, userId: string, type: string, isRead: Boolean, notif: string }[]>([]);
    const [showNotification, setShowNotification] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { token } = useAuth();
    const { socket } = useSocket();

    useEffect(() => {
        if (socket == undefined) return;

        socket.on('RequestReceived', ({ username, userId, image }: { username: string, userId: string, image: string }) => {
            setShowNotification(true);
        })
    }, [socket]);
    
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
    const { data: notifData, loading: notifLoading, error: notifError, refetch: notifRefetch } = useQuery(NOTIF_QUERY);

    if (notifLoading) return <p>Loading...</p>;
    if (notifError) return <p>Error: {notifError?.message}</p>;


    const updateNotifications = (notifications: Notifs[]) => {
        let notificationList: { id: string; userId: string; type: string; isRead: Boolean; notif: string;}[] = [];
        for (let i = 0; i < notifications.length; i++){
            if (!notifications[i].isRead) {
                let newNotification = {
                    id: notifications[i].id,
                    userId: notifications[i].sender.id,
                    type: notifications[i].type,
                    isRead: notifications[i].isRead,
                    notif: ''
                };
    
                if (notifications[i].type === 'FRIEND_REQUEST') {
                    newNotification.notif = `${notifications[i].sender.username} sent you a friend request`;
                } else if (notifications[i].type === 'ACHIEVEMENT') {
                    newNotification.notif = 'New achievement';
                }
                notificationList.push(newNotification);
            }
        }
        if (showDropdown == false && notificationList.length > 0)
            setShowNotification(true);
        setNotifications(notificationList);
    }
    const HandleOnLoad = async () => {
        let notifications = await notifRefetch();
        notifications = await notifRefetch();
        updateNotifications(notifications.data?.getUserNotifications);
    };
    const toggleDropdown = async () => {
        setShowDropdown(!showDropdown);
        let notifications = await notifRefetch();
        notifications = await notifRefetch();
        updateNotifications(notifications.data?.getUserNotifications);
        setShowNotification(false);
    };

    const updateIsRead = async (notifId: string) => {
        try {
            await updateNotifIsRead({ variables: { id: notifId } });
        } catch (error) {
            console.error("Error updating Read:", error.message);
        }
    };

    return (
        <div className='notifs' onLoad={HandleOnLoad}>
            <div className="bellDiv" onClick={toggleDropdown}>
                <img
                    className="bellImg"
                    src="/Icons/Bell.png"
                    alt="search"
                />
                <div className={showNotification ? "cercleNotif visible" : "cercleNotif"}></div>
            </div>
            {showDropdown && (
                <div className="notificationDropdown" ref={dropdownRef}>
                    {/* Display notifications */}
                    {notifications.length > 0 ? (
                        <ul className="notificationList">
                            {notifications.map((notification, index) => (
                                notification ? (
                                    <Link key={index} to={`/profiles?id=${notification.userId}`} onClick={() => updateIsRead(notification.id)}>
                                        <li className="notif" key={index}>{notification.notif}</li>
                                    </Link>
                                ) : null
                            ))}
                        </ul>
                    ) : (
                        <div className="noNotificationsContainer">
                            <p className="noNotificationsMessage">No notifications yet</p>
                            <img className="noNotificationsImage" src="/Icons/noNotifs.png" alt="No notifications" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Notifications;
